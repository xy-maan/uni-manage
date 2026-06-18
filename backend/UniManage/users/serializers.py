from rest_framework import serializers
from .models import User, StudentProfile, SupervisorProfile, Skill, AcademicLevel, Department

class AcademicLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicLevel
        fields = ['id', 'name']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_official']

class CustomSkillField(serializers.ListField):
    child = serializers.ListField(allow_empty=True) # Let's handle it in the serializer's update/create method instead for robustness. Or just parse it in `to_internal_value`.

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'role', 'avatar_url']
        read_only_fields = ['email']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    department = DepartmentSerializer(read_only=True)
    academic_level = AcademicLevelSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'user', 
            'student_id',
            'department', 
            'academic_level', 
            'gpa', 
            'skills',
            'looking_for_course_project_team',
            'looking_for_grad_project_team',
            'github_url',
            'linkedin_url'
        ]
        read_only_fields = ['skills']


class SupervisorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    title_display = serializers.SerializerMethodField()
    expertise = SkillSerializer(many=True, read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = SupervisorProfile
        fields = [
            'user', 
            'title', 
            'title_display', 
            'department', 
            'expertise',
            'max_team_capacity',
            'scholar_url',
            'linkedin_url'
        ]
        read_only_fields = ['expertise']

    def get_title_display(self, obj):
        return obj.get_title_display()

class StudentListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    department = DepartmentSerializer(source='student_profile.department', read_only=True)
    academic_level = AcademicLevelSerializer(source='student_profile.academic_level', read_only=True)
    gpa = serializers.FloatField(source='student_profile.gpa', read_only=True)
    tags = SkillSerializer(source='student_profile.skills', many=True, read_only=True)
    description = serializers.CharField(source='bio', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'role', 'avatar_url', 'department', 'academic_level', 'gpa', 'tags', 'description']


class SupervisorListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    title = serializers.CharField(source='supervisor_profile.title', read_only=True)
    title_display = serializers.SerializerMethodField()
    department = DepartmentSerializer(source='supervisor_profile.department', read_only=True)
    expertise = SkillSerializer(source='supervisor_profile.expertise', many=True, read_only=True)
    max_team_capacity = serializers.IntegerField(source='supervisor_profile.max_team_capacity', read_only=True)
    scholar_url = serializers.URLField(source='supervisor_profile.scholar_url', read_only=True)
    linkedin_url = serializers.URLField(source='supervisor_profile.linkedin_url', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'role', 'avatar_url', 'title', 'title_display', 'department', 'expertise', 'max_team_capacity', 'scholar_url', 'linkedin_url']

    def get_title_display(self, obj):
        if hasattr(obj, 'supervisor_profile') and obj.supervisor_profile:
            return obj.supervisor_profile.get_title_display()
        return None


class CompleteProfileSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    role = serializers.ChoiceField(choices=User.Role.choices)
    
    student_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    department = serializers.IntegerField(required=False, allow_null=True)
    academic_level = serializers.IntegerField(required=False, allow_null=True)
    gpa = serializers.FloatField(required=False, allow_null=True)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    looking_for_course_project_team = serializers.BooleanField(required=False, default=True)
    looking_for_grad_project_team = serializers.BooleanField(required=False, default=True)
    github_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    linkedin_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    
    registration_code = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    expertise = serializers.ListField(child=serializers.CharField(), required=False)
    max_team_capacity = serializers.IntegerField(required=False, default=5)
    scholar_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)