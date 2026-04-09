from rest_framework import serializers
from .models import User, StudentProfile, SupervisorProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['email']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'user', 
            'major', 
            'academic_level', 
            'gpa', 
            'skills'
        ]


class SupervisorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role_display = serializers.SerializerMethodField()

    class Meta:
        model = SupervisorProfile
        fields = [
            'user', 
            'is_professor', 
            'role_display', 
            'department', 
            'expertise'
        ]

    def get_role_display(self, obj):
        return "Primary Supervisor (Professor)" if obj.is_professor else "Assistant Supervisor (TA)"

class CompleteProfileSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.Role.choices)
    
    major = serializers.CharField(required=False, allow_blank=True)
    academic_level = serializers.CharField(required=False, allow_blank=True)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    
    department = serializers.CharField(required=False, allow_blank=True)
    expertise = serializers.ListField(child=serializers.CharField(), required=False)
    is_professor = serializers.BooleanField(required=False)