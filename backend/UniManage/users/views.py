from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.microsoft.views import MicrosoftGraphOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf import settings

from .models import StudentProfile, SupervisorProfile, User
from .serializers import StudentProfileSerializer, SupervisorProfileSerializer, UserSerializer

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/login/callback"
    client_class = OAuth2Client

class UserStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_complete = user.role != ""
        
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
        role = request.data.get('role')
        
        if user.role != "":
            return Response({"error": "Profile already completed"}, status=status.HTTP_400_BAD_REQUEST)

        if role not in [User.Role.STUDENT, User.Role.SUPERVISOR]:
            return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = role
        user.save()

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