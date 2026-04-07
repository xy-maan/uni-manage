from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.forms import ValidationError

class EgyptianUniAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        email = sociallogin.account.extra_data.get('email', '').lower()

        allowed_emails = ['ojdgs697@gmail.com'] 

        if not email.endswith('.edu.eg') and email not in allowed_emails:
            raise ValidationError("Use your .edu.eg email.")