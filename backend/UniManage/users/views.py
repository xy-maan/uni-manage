from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf import settings
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from urllib.parse import urlencode
import requests

from .models import StudentProfile, SupervisorProfile, User
from .serializers import StudentProfileSerializer, SupervisorProfileSerializer, UserSerializer

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_CALLBACK_URL
    client_class = OAuth2Client

class GoogleAuthRedirect(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            'client_id': settings.GOOGLE_CLIENT_ID,
            'redirect_uri': settings.GOOGLE_CALLBACK_URL,
            'response_type': 'code',
            'scope': 'openid email profile',
            'access_type': 'online',
            'prompt': 'select_account',
        }
        url = f"{google_auth_url}?{urlencode(params)}"
        return HttpResponseRedirect(url)

class GoogleAuthCallback(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('code')
        error = request.GET.get('error')

        if error:
            return redirect(f"{settings.FRONTEND_URL}/auth/error?error={error}")

        if not code:
            return redirect(f"{settings.FRONTEND_URL}/auth/error?error=no_code")

        try:
            token_response = requests.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'code': code,
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'redirect_uri': settings.GOOGLE_CALLBACK_URL,
                    'grant_type': 'authorization_code',
                },
                timeout=10
            )
            token_data = token_response.json()

            if 'error' in token_data:
                return redirect(f"{settings.FRONTEND_URL}/auth/error?error={token_data['error']}")

            access_token = token_data.get('access_token')
            id_token = token_data.get('id_token')

            login_response = requests.post(
                request.build_absolute_uri('/api/users/login/google/'),
                json={
                    'access_token': access_token,
                    'id_token': id_token,
                },
                timeout=10
            )

            if login_response.status_code == 200:
                jwt_data = login_response.json()
                params = {
                    'access_token': jwt_data.get('access'),
                    'refresh_token': jwt_data.get('refresh'),
                }
                return redirect(f"{settings.FRONTEND_URL}/auth/success?{urlencode(params)}")
            else:
                error_detail = login_response.json().get('detail', 'login_failed')
                return redirect(f"{settings.FRONTEND_URL}/auth/error?error={error_detail}")

        except requests.RequestException:
            return redirect(f"{settings.FRONTEND_URL}/auth/error?error=network_error")

class UserStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if user.role == User.Role.STUDENT:
            is_complete = hasattr(user, 'student_profile')
        elif user.role == User.Role.SUPERVISOR:
            is_complete = hasattr(user, 'supervisor_profile')
        else:
            is_complete = False
        
        return Response({
            "is_complete": is_complete,
            "role": user.role,
            "email": user.email,
            "full_name": user.get_full_name()
        })

class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        if hasattr(user, 'student_profile') or hasattr(user, 'supervisor_profile'):
            return Response({"error": "Profile already completed"}, status=status.HTTP_400_BAD_REQUEST)

        role = user.role

        if role == User.Role.STUDENT:
            StudentProfile.objects.create(
                user=user,
                major=request.data.get('major'),
                academic_level=request.data.get('academic_level'),
                skills=request.data.get('skills', []),
                gpa=request.data.get('gpa', 0.0)
            )
            return Response({"message": "Student profile created successfully"}, status=status.HTTP_201_CREATED)

        elif role == User.Role.SUPERVISOR:
            SupervisorProfile.objects.create(
                user=user,
                is_professor=request.data.get('is_professor', True),
                department=request.data.get('department'),
                expertise=request.data.get('expertise', [])
            )
            return Response({"message": "Supervisor profile created successfully"}, status=status.HTTP_201_CREATED)

class StudentProfileDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        return self.request.user.student_profile

class SupervisorProfileDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SupervisorProfileSerializer

    def get_object(self):
        return self.request.user.supervisor_profile