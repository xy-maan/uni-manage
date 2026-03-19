from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),  # Allauth URLs (required for OAuth flow)
    path('api/accounts/', include('accounts.urls')),
]
