from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    is_official = models.BooleanField(default=False)
    generated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='generated_skills')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class SkillAlias(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='aliases')
    alias = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.alias

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        SUPERVISOR = "SUPERVISOR", "Supervisor"

    role = models.CharField(max_length=20, choices=Role.choices, blank=True, null=True)
    email = models.EmailField(unique=True) 
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

class AcademicLevel(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    academic_level = models.ForeignKey(AcademicLevel, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    gpa = models.FloatField(null=True, blank=True)
    skills = models.ManyToManyField(Skill, related_name='students')
    looking_for_course_project_team = models.BooleanField(default=True)
    looking_for_grad_project_team = models.BooleanField(default=True)
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

class SupervisorProfile(models.Model):
    class Title(models.TextChoices):
        DOCTOR = "DOCTOR", "Doctor"
        TA = "TA", "Teaching Assistant"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor_profile')
    title = models.CharField(max_length=20, choices=Title.choices, default=Title.DOCTOR)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='supervisors')
    expertise = models.ManyToManyField(Skill, related_name='supervisors')
    max_team_capacity = models.PositiveIntegerField(default=5)
    scholar_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)