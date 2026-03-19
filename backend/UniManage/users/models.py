# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        SUPERVISOR = "SUPERVISOR", "Supervisor"

    role = models.CharField(max_length=20, choices=Role.choices)
    # This stores the .edu.eg email verified by OAuth
    email = models.EmailField(unique=True) 

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    major = models.CharField(max_length=100)
    academic_level = models.CharField(max_length=50) # Senior, etc.
    gpa = models.FloatField(null=True, blank=True)
    skills = models.JSONField(default=list) # To store the tags like "React, Python"

class SupervisorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor_profile')
    is_professor = models.BooleanField(default=True) # To distinguish Prof vs TA
    department = models.CharField(max_length=100)
    expertise = models.JSONField(default=list) # Tags like "Machine Learning"