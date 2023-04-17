from rest_framework import generics
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .models import User, Event, Invitation, Item, Post
from .serializers import EventSerializer, ItemSerializer


# if you want to use Authorization Code Grant, use this
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'https://potluck.herokuapp.com/google-signin'
    client_class = OAuth2Client


class EventsHosting(generics.ListAPIView):
    serializer_class = EventSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.filter(
            host__id=user.id,
            date_scheduled__gte=timezone.now().date()
        )
        return queryset


class EventsAttending(generics.ListAPIView):
    serializer_class = EventSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.filter(
            invitations__guest__id=user.id,
            invitations__response=True,
            date_scheduled__gte=timezone.now().date()
        )
        return queryset


class Items(generics.ListAPIView):
    serializer_class = ItemSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Item.objects.filter(
            owner__id=user.id,
            event__date_scheduled__gte=timezone.now().date()
        )
        return queryset


class CreateEvent(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
