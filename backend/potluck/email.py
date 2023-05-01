# django imports
from django.conf import settings
from django.core.mail import send_mail


# Template function for sending a simple email
def send(subject, message, recipients: list, html_message=None):
    if not html_message:
        html_message = message
    send_mail(
        subject=subject,
        message=message,
        html_message=html_message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=recipients)
