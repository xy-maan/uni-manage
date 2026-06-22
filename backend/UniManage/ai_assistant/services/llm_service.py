import json
import os

import requests
from rest_framework.exceptions import APIException


class AIProviderError(APIException):
    status_code = 502
    default_detail = 'AI provider unavailable.'
    default_code = 'AI_PROVIDER_ERROR'


class LLMService:
    def __init__(self):
        self.provider = os.getenv('AI_PROVIDER', 'openai').lower()
        self.timeout = int(os.getenv('AI_TIMEOUT', '60'))

    def _headers(self):
        if self.provider == 'deepseek':
            return {
                'Authorization': f"Bearer {os.getenv('DEEPSEEK_API_KEY')}",
                'Content-Type': 'application/json',
            }
        if self.provider == 'gemini':
            return {'Content-Type': 'application/json'}
        return {
            'Authorization': f"Bearer {os.getenv('OPENAI_API_KEY')}",
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/uni-manage',
            'X-Title': 'UniManage',
        }

    def _url(self):
        if self.provider == 'deepseek':
            return os.getenv('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions')
        if self.provider == 'gemini':
            model = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
            key = os.getenv('GEMINI_API_KEY', '')
            return f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}'
        return os.getenv('OPENAI_API_URL', 'https://api.openai.com/v1/chat/completions')

    def _call_gemini(self, messages):
        contents = []
        for msg in messages:
            role = 'model' if msg['role'] == 'assistant' else msg['role']
            contents.append({
                'role': role,
                'parts': [{'text': msg['content']}],
            })
        payload = {
            'contents': contents,
            'generationConfig': {
                'temperature': float(os.getenv('AI_TEMPERATURE', '0.7')),
                'maxOutputTokens': int(os.getenv('AI_MAX_TOKENS', '2048')),
            },
        }
        resp = requests.post(self._url(), json=payload, headers=self._headers(), timeout=self.timeout)
        if resp.status_code in (400, 403, 429):
            body = resp.json()
            msg = body.get('error', {}).get('message', str(resp.status_code))
            raise AIProviderError(msg)
        resp.raise_for_status()
        data = resp.json()
        return data['candidates'][0]['content']['parts'][0]['text']

    def chat(self, messages):
        if self.provider == 'gemini':
            try:
                return self._call_gemini(messages)
            except AIProviderError:
                raise
            except (KeyError, json.JSONDecodeError):
                raise AIProviderError('Malformed response from Gemini.')
            except requests.exceptions.Timeout:
                raise AIProviderError('Gemini request timed out.')
            except requests.exceptions.ConnectionError:
                raise AIProviderError('Could not connect to Gemini.')
            except requests.exceptions.HTTPError:
                raise AIProviderError('Gemini returned an error.')

        payload = {
            'model': self._model(),
            'messages': messages,
            'temperature': float(os.getenv('AI_TEMPERATURE', '0.7')),
            'max_tokens': int(os.getenv('AI_MAX_TOKENS', '2048')),
        }
        try:
            resp = requests.post(self._url(), json=payload, headers=self._headers(), timeout=self.timeout)
            resp.raise_for_status()
            data = resp.json()
            return data['choices'][0]['message']['content']
        except requests.exceptions.Timeout:
            raise AIProviderError('AI provider request timed out.')
        except requests.exceptions.ConnectionError:
            raise AIProviderError('Could not connect to AI provider.')
        except requests.exceptions.HTTPError as e:
            body = {}
            try:
                body = resp.json()
            except (json.JSONDecodeError, ValueError):
                pass
            if resp.status_code == 401:
                raise AIProviderError('Invalid AI provider API key.')
            if resp.status_code == 402:
                raise AIProviderError(body.get('error', {}).get('message', 'Insufficient balance on AI provider account.'))
            if resp.status_code == 429:
                msg = body.get('error', {}).get('message', 'Rate limited by AI provider.')
                raise AIProviderError(f'{msg} (429)')
            err_msg = body.get('error', {}).get('message', '')
            detail = f'AI provider returned error: {resp.status_code}'
            if err_msg:
                detail += f' - {err_msg}'
            raise AIProviderError(detail)
        except (KeyError, json.JSONDecodeError):
            raise AIProviderError('Malformed response from AI provider.')
        except (KeyError, json.JSONDecodeError):
            raise AIProviderError('Malformed response from AI provider.')

    def _model(self):
        if self.provider == 'deepseek':
            return os.getenv('DEEPSEEK_MODEL', 'deepseek-chat')
        return os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

    def generate(self, prompt):
        return self.chat([{'role': 'user', 'content': prompt}])
