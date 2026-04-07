from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        SUPERVISOR = "SUPERVISOR", "Supervisor"

    role = models.CharField(max_length=20, choices=Role.choices)
    email = models.EmailField(unique=True) 

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    major = models.CharField(max_length=100)
    academic_level = models.CharField(max_length=50)
    gpa = models.FloatField(null=True, blank=True)
    skills = models.JSONField(default=list)

class SupervisorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor_profile')
    is_professor = models.BooleanField(default=True)
    department = models.CharField(max_length=100)
    expertise = models.JSONField(default=list)