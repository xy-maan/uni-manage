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

from .models import StudentProfile, SupervisorProfile, User, Skill, SkillAlias, AcademicLevel, Department
from .serializers import StudentProfileSerializer, SupervisorProfileSerializer, UserSerializer, SkillSerializer, DepartmentSerializer, AcademicLevelSerializer, StudentListSerializer, SupervisorListSerializer
from django.db.models import Q

def resolve_skills(skill_input_list, user=None):
    """
    Takes a list of skills from frontend, which could be integer IDs (as strings or ints)
    or custom brand new strings. Returns a list of Skill objects.
    """
    skill_objs = []
    for item in skill_input_list:
        try:
            # If item can be parsed as int, assume it's a Skill ID
            skill_id = int(item)
            skill = Skill.objects.filter(id=skill_id).first()
            if skill:
                skill_objs.append(skill)
        except ValueError:
            # It's a custom string. Get or create with is_official=False
            item_str = str(item).strip()
            if item_str:
                skill, created = Skill.objects.get_or_create(
                    name__iexact=item_str,
                    defaults={'name': item_str, 'is_official': False, 'generated_by': user}
                )
                skill_objs.append(skill)
    return skill_objs

class SkillSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get('q', '').strip()
        if not query:
            return Response([])

        # Check aliases first
        aliases = SkillAlias.objects.filter(alias__icontains=query)
        alias_skills = [a.skill for a in aliases]

        # Check official skills and non-official ones
        skills = Skill.objects.filter(name__icontains=query)

        # Combine, avoiding duplicates
        result_skills = set(alias_skills) | set(skills)
        serializer = SkillSerializer(list(result_skills), many=True)
        return Response(serializer.data)

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
        # Check and update user base fields
        username = request.data.get('username')
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.exclude(id=user.id).filter(username=username).exists():
            return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user.username = username
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.bio = request.data.get('bio', user.bio)
        
        role_input = request.data.get('role')
        if not role_input or role_input not in [User.Role.STUDENT, User.Role.SUPERVISOR]:
            return Response({"error": "Valid role is required (STUDENT or SUPERVISOR)"}, status=status.HTTP_400_BAD_REQUEST)

        skills_input = request.data.get('skills', [])
        is_expertise = request.data.get('expertise', request.data.get('skills', []))
        
        if role_input == User.Role.STUDENT:
            department_id = request.data.get('department')
            academic_level_id = request.data.get('academic_level')
            
            dept_obj = None
            if department_id:
                try:
                    dept_obj = Department.objects.get(id=department_id)
                except (Department.DoesNotExist, ValueError, TypeError):
                    return Response({"error": "Invalid department ID"}, status=status.HTTP_400_BAD_REQUEST)
                
            level_obj = None
            if academic_level_id:
                try:
                    level_obj = AcademicLevel.objects.get(id=academic_level_id)
                except (AcademicLevel.DoesNotExist, ValueError, TypeError):
                    return Response({"error": "Invalid academic level ID"}, status=status.HTTP_400_BAD_REQUEST)

            profile = StudentProfile.objects.create(
                user=user,
                student_id=request.data.get('student_id'),
                department=dept_obj,
                academic_level=level_obj,
                gpa=request.data.get('gpa'),
                looking_for_course_project_team=request.data.get('looking_for_course_project_team', True),
                looking_for_grad_project_team=request.data.get('looking_for_grad_project_team', True),
                github_url=request.data.get('github_url'),
                linkedin_url=request.data.get('linkedin_url')
            )
            # Resolve and add skills
            resolved_skills = resolve_skills(skills_input, user=user)
            profile.skills.set(resolved_skills)

            user.role = User.Role.STUDENT
            user.save()

            return Response({"message": "Student profile created successfully"}, status=status.HTTP_201_CREATED)

        elif role_input == User.Role.SUPERVISOR:
            registration_code = request.data.get('registration_code')
            if registration_code == settings.PROFESSOR_REGISTRATION_CODE:
                title = SupervisorProfile.Title.DOCTOR
            elif registration_code == settings.TA_REGISTRATION_CODE:
                title = SupervisorProfile.Title.TA
            else:
                return Response({"error": "Invalid registration code."}, status=status.HTTP_400_BAD_REQUEST)

            department_id = request.data.get('department')
            dept_obj = None
            if department_id:
                try:
                    dept_obj = Department.objects.get(id=department_id)
                except (Department.DoesNotExist, ValueError, TypeError):
                    return Response({"error": "Invalid department ID"}, status=status.HTTP_400_BAD_REQUEST)

            profile = SupervisorProfile.objects.create(
                user=user,
                title=title,
                department=dept_obj,
                max_team_capacity=request.data.get('max_team_capacity', 5),
                scholar_url=request.data.get('scholar_url'),
                linkedin_url=request.data.get('linkedin_url')
            )
            resolved_expertise = resolve_skills(is_expertise, user=user)
            profile.expertise.set(resolved_expertise)

            user.role = User.Role.SUPERVISOR
            user.save()

            return Response({"message": "Supervisor profile created successfully"}, status=status.HTTP_201_CREATED)

class StudentProfileDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        return self.request.user.student_profile
        
    def perform_update(self, serializer):
        profile = serializer.save()
        data = self.request.data
        if 'skills' in data:
            resolved_skills = resolve_skills(data['skills'], user=self.request.user)
            profile.skills.set(resolved_skills)
            
        # Handle custom taxonomy fields
        if 'department' in data:
            department_id = data['department']
            if department_id:
                try:
                    profile.department = Department.objects.get(id=department_id)
                except (Department.DoesNotExist, ValueError, TypeError):
                    raise serializers.ValidationError({"department": "Invalid department ID"})
            else:
                profile.department = None
                
        if 'academic_level' in data:
            level_id = data['academic_level']
            if level_id:
                try:
                    profile.academic_level = AcademicLevel.objects.get(id=level_id)
                except (AcademicLevel.DoesNotExist, ValueError, TypeError):
                    raise serializers.ValidationError({"academic_level": "Invalid academic level ID"})
            else:
                profile.academic_level = None
                
        profile.save()

class SupervisorProfileDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SupervisorProfileSerializer

    def get_object(self):
        return self.request.user.supervisor_profile

    def perform_update(self, serializer):
        profile = serializer.save()
        data = self.request.data
        if 'expertise' in data:
            resolved_expertise = resolve_skills(data['expertise'], user=self.request.user)
            profile.expertise.set(resolved_expertise)

        if 'department' in data:
            department_id = data['department']
            if department_id:
                try:
                    profile.department = Department.objects.get(id=department_id)
                except (Department.DoesNotExist, ValueError, TypeError):
                    raise serializers.ValidationError({"department": "Invalid department ID"})
            else:
                profile.department = None

        profile.save()
class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = []

class AcademicLevelListView(generics.ListAPIView):
    queryset = AcademicLevel.objects.all().order_by('id')
    serializer_class = AcademicLevelSerializer
    permission_classes = []


class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(role=User.Role.STUDENT).order_by('username')
    serializer_class = StudentListSerializer
    permission_classes = [IsAuthenticated]


class SupervisorListView(generics.ListAPIView):
    queryset = User.objects.filter(role=User.Role.SUPERVISOR).order_by('username')
    serializer_class = SupervisorListSerializer
    permission_classes = [IsAuthenticated]
