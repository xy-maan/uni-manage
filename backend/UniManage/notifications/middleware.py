from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


@database_sync_to_async
def get_user_from_token(raw_token):
    try:
        authentication = JWTAuthentication()
        validated_token = authentication.get_validated_token(raw_token)
        return authentication.get_user(validated_token)
    except (InvalidToken, TokenError):
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        query = parse_qs(scope.get('query_string', b'').decode())
        token = query.get('token', [None])[0]
        if not token:
            headers = dict(scope.get('headers', []))
            authorization = headers.get(b'authorization', b'').decode()
            if authorization.lower().startswith('bearer '):
                token = authorization.split(' ', 1)[1]
        if token:
            scope['user'] = await get_user_from_token(token)
        return await self.app(scope, receive, send)


def JWTAuthMiddlewareStack(app):
    return AuthMiddlewareStack(JWTAuthMiddleware(app))
