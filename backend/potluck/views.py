from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .models import User, Event, Invitation, Item, Post
from .serializers import UserSerializer, EventSerializer, InvitationSerializer, ItemSerializer, PostSerializer


# if you want to use Authorization Code Grant, use this
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'https://potluck.herokuapp.com/google-signin'
    client_class = OAuth2Client


class EventsView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
