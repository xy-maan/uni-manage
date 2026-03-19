from django.urls import path, include
from dj_rest_auth.views import LogoutView
from .views import (
    GoogleLogin, MicrosoftLogin, UserStatusView,
    CompleteProfileView, StudentProfileDetail, SupervisorProfileDetail
)

urlpatterns = [
    # OAuth Endpoints
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('microsoft/', MicrosoftLogin.as_view(), name='microsoft_login'),

    # Logout Endpoint (Works for both Google and Microsoft)
    path('logout/', LogoutView.as_view(), name='logout'),

    # Profile & Status Logic
    path('status/', UserStatusView.as_view(), name='user_status'),
    path('complete-profile/', CompleteProfileView.as_view(), name='complete_profile'),

    # Detail Profile
    path('profile/student/', StudentProfileDetail.as_view(), name='student_profile'),
    path('profile/supervisor/', SupervisorProfileDetail.as_view(), name='supervisor_profile'),
]