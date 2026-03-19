from django.urls import path, include
from dj_rest_auth.views import LogoutView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    GoogleLogin, MicrosoftLogin, UserStatusView,
    CompleteProfileView, StudentProfileDetail, SupervisorProfileDetail
)

urlpatterns = [
    # Authentication Endpoints
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('login/microsoft/', MicrosoftLogin.as_view(), name='microsoft_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Status
    path('status/', UserStatusView.as_view(), name='user_status'),

    # Profile Management
    path('profile/complete/', CompleteProfileView.as_view(), name='complete_profile'),
    path('profile/student/', StudentProfileDetail.as_view(), name='student_profile'),
    path('profile/supervisor/', SupervisorProfileDetail.as_view(), name='supervisor_profile'),
]