

# AUTHENTICATION IMPORTS
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.registration.views import RegisterView

# PERMISSIONS IMPORTS
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from .permissions import IsHost, ItemDetailPermission, IsPostAuthorOrHost, IsGuest

# MODELS IMPORTS
from .models import User, Event, Invitation, Item, Post

# SERIALIZERS IMPORTS
from .serializers import UserSerializer, EventSerializer, EventItemSerializer, UserItemSerializer, ReserveItemSerializer, UserInvitationSerializer, PostSerializer
from .serializers import CustomRegisterSerializer

# MISC IMPORTS
from rest_framework import generics
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.utils import timezone
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


class UserItems(generics.ListAPIView):
    serializer_class = UserItemSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Item.objects.filter(
            owner__id=user.id,
            event__date_scheduled__gte=timezone.now().date()
        )
        return queryset


class UserInvitations(generics.ListAPIView):
    serializer_class = UserInvitationSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Invitation.objects.filter(
            guest__id=user.id,
            event__date_scheduled__gte=timezone.now().date()
        )
        return queryset


class CreateEvent(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)


# need some kind of permission for non-party members
class EventDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsHost() | IsGuest()]
        else:
            return [IsHost()]


# need to make it so that:
# users can only create items for events they are hosting or attending
class CreateItem(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = EventItemSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        event = get_object_or_404(Event, pk=self.kwargs["pk"])
        created_by = self.request.user
        if self.request.user != event.host:
            serializer.save(event=event, created_by=created_by,
                            owner=self.request.user)
        else:
            serializer.save(event=event, created_by=created_by)


class ItemDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = EventItemSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [ItemDetailPermission]


class ReserveItem(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ReserveItemSerializer
    # permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(Item, pk=pk)
        return obj

    def perform_update(self, serializer):
        item = get_object_or_404(Item, pk=self.kwargs["pk"])
        if self.request.user == item.owner:
            serializer.save(owner=None)
        elif item.owner == None:
            serializer.save(owner=self.request.user)
        elif item.owner != self.request.user and item.owner != None:
            raise PermissionDenied()
        else:
            serializer.save()


# add permissions
# guests and hosts only
class ListCreatePost(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_pk = self.kwargs['pk']
        return Post.objects.filter(event_id=event_pk)

    def perform_create(self, serializer):
        event = get_object_or_404(Event, pk=self.kwargs["pk"])
        author = self.request.user
        serializer.save(event=event, author=author)


# add permissions
# guests can delete their posts
# host can delete any post
class DeletePost(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [IsPostAuthorOrHost]
