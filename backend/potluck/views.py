from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .models import User, Event, Invitation, Item, Post
from .serializers import UserSerializer, EventSerializer, ItemSerializer
from .permissions import IsHost, IsItemHost

from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

import urllib.parse

import requests


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def create(self, request, *args, **kwargs):
        # perform additional actions here
        response = super().create(request, *args, **kwargs)
        # perform additional actions here
        return response


class GoogleLogin(SocialLoginView):
    # SOCIAL AUTH CODE IN PROGRESS
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:8000/dj-rest-auth/google/code'
    client_class = OAuth2Client


@api_view(['GET'])
def CodeView(request):
    # SOCIAL AUTH CODE IN PROGRESS
    """
    List all code snippets, or create a new snippet.
    """

    if request.method == 'GET':
        code = urllib.parse.unquote(request.query_params['code'])

        url = request.build_absolute_uri('/dj-rest-auth/google/')
        response = requests.post(url, json={"code": code})
        return (response.json())


class UserProfile(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


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


class EventDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        else:
            return [IsHost()]


class CreateItem(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        event = get_object_or_404(Event, pk=self.kwargs["pk"])
        serializer.save(event=event)
