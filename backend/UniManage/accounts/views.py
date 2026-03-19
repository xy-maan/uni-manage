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

# 1. GOOGLE & MICROSOFT LOGIN VIEWS
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/login/callback" # Your React URL
    client_class = OAuth2Client

class MicrosoftLogin(SocialLoginView):
    adapter_class = MicrosoftGraphOAuth2Adapter
    callback_url = "http://localhost:3000/login/callback"
    client_class = OAuth2Client

# 2. CHECK USER STATUS VIEW
# React calls this after login to know where to redirect the user
class UserStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # If role is empty, they haven't completed the registration step yet
        is_complete = user.role != ""
        
        return Response({
            "is_complete": is_complete,
            "role": user.role,
            "email": user.email,
            "full_name": user.get_full_name()
        })

# 3. COMPLETE PROFILE VIEW
# This is where they submit the Major, Academic Level, or Department
class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        role = request.data.get('role') # Expecting 'STUDENT' or 'SUPERVISOR'
        
        if user.role != "":
            return Response({"error": "Profile already completed"}, status=status.HTTP_400_BAD_REQUEST)

        if role not in [User.Role.STUDENT, User.Role.SUPERVISOR]:
            return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

        # Update the base User model
        user.role = role
        user.save()

        # Handle Student Logic
        if role == User.Role.STUDENT:
            StudentProfile.objects.create(
                user=user,
                major=request.data.get('major'),
                academic_level=request.data.get('academic_level'),
                skills=request.data.get('skills', []), # JSON list from React tags
                gpa=request.data.get('gpa', 0.0)
            )
            return Response({"message": "Student profile created successfully"}, status=status.HTTP_201_CREATED)

        # Handle Supervisor Logic
        elif role == User.Role.SUPERVISOR:
            SupervisorProfile.objects.create(
                user=user,
                is_professor=request.data.get('is_professor', True),
                department=request.data.get('department'),
                expertise=request.data.get('expertise', []) # JSON list
            )
            return Response({"message": "Supervisor profile created successfully"}, status=status.HTTP_201_CREATED)

# 4. PROFILE DETAIL VIEWS
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