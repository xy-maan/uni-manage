from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('allauth.urls')),
    path('api/users/', include('users.urls')),
]
