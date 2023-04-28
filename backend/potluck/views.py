from rest_framework.parsers import MultiPartParser

# AUTHENTICATION IMPORTS
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.registration.views import RegisterView

# PERMISSIONS IMPORTS
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from .permissions import IsHost, ItemDetailPermission, IsPostAuthorOrHost, IsGuest, ItemPostInvitationHost, ItemPostInvitationGuest, InvitationDetailPermission

# MODELS IMPORTS
from .models import User, DietaryRestriction, Event, Invitation, Item, Post, Notification

# SERIALIZERS IMPORTS
from .serializers import (UserSerializer, UserSerializerShort, EventSerializer,
                          EventItemSerializer, UserItemSerializer,
                          UserInvitationSerializer,
                          PostSerializer, InvitationSerializer, DietaryRestrictionSerializer, NotificationSerializer)
from .serializers import CustomRegisterSerializer

# MISC IMPORTS
from rest_framework import generics
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.utils import timezone
import urllib.parse
import requests
from .email import send
import json
from django.db.models import Q

from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.response import Response


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer
    parser_classes = [MultiPartParser]

    def perform_create(self, serializer):
        email = self.request.data.get('email')
        if Invitation.objects.filter(email=email).exists():
            created_user = serializer.save(request=self.request)
            updated_invitations = Invitation.objects.filter(email=email)
            for invitation in updated_invitations:
                invitation.guest = created_user
                invitation.save()
        else:
            serializer.save(request=self.request)


class GoogleLogin(SocialLoginView):
    # https://dj-rest-auth.readthedocs.io/en/latest/installation.html#social-authentication-optional
    class GoogleAdapter(GoogleOAuth2Adapter):
        access_token_url = "https://oauth2.googleapis.com/token"
        authorize_url = "https://accounts.google.com/o/oauth2/v2/auth"
        profile_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    adapter_class = GoogleAdapter
    # Callback URL was used by mobile app
    callback_url = "http://localhost:8000/accounts/google/code"
    client_class = OAuth2Client


@api_view(['GET'])
def CodeView(request):
    # SOCIAL AUTH CODE IN PROGRESS
    """
    List all code snippets, or create a new snippet.
    """

    if request.method == 'GET':
        # code = urllib.parse.unquote(request.query_params['code'])

        # url = request.build_absolute_uri('/dj-rest-auth/google/')
        # response = requests.post(url, json={"code": code})
        # return (response.json())
        code = urllib.parse.unquote(request.query_params['code'])
        return Response({
            "code": code,
            "curl": "curl -H 'code " + code + "' http://localhost:8000/accounts/google/"})


class UserProfile(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        dietary_restrictions = []
        dietary_restrictions_names_json = self.request.data.get(
            'dietary_restrictions_names')
        if dietary_restrictions_names_json is not None:
            dietary_restrictions_names = json.loads(
                dietary_restrictions_names_json)
            for dr in dietary_restrictions_names:
                dietary_restrictions.append(get_object_or_404(
                    DietaryRestriction, name=dr))
            serializer.instance.dietary_restrictions.set(dietary_restrictions)
        serializer.save()


class EventHistory(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.filter(
            Q(host__id=user.id) | Q(
                invitations__guest__id=user.id, invitations__response=True),
            date_scheduled__lt=timezone.now().date()
        ).distinct().order_by('-date_scheduled')
        return queryset


class UserItems(generics.ListAPIView):
    serializer_class = UserItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(items__owner=user,
                                    date_scheduled__gte=timezone.now().date()).distinct()


class UserInvitations(generics.ListAPIView):
    serializer_class = UserInvitationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Invitation.objects.filter(
            guest=user,
            event__date_scheduled__gte=timezone.now().date()
        )
        return queryset


class ListCreateEvent(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.filter(
            Q(host__id=user.id) | Q(
                invitations__guest__id=user.id, invitations__response=True),
            date_scheduled__gte=timezone.now().date()
        ).distinct()
        return queryset

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)


class EventDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsHost() | IsGuest()]
        else:
            return [IsHost()]


class ListCreateItem(generics.ListCreateAPIView):
    serializer_class = EventItemSerializer
    permission_classes = [ItemPostInvitationGuest | ItemPostInvitationHost]

    def get_queryset(self):
        event_pk = self.kwargs['pk']
        return Item.objects.filter(event_id=event_pk)

    def perform_create(self, serializer):
        event = get_object_or_404(Event, pk=self.kwargs["pk"])
        created_by = self.request.user
        if self.request.user != event.host:
            serializer.save(event=event, created_by=created_by,
                            owner=self.request.user)
        else:
            serializer.save(event=event, created_by=created_by)

        dietary_restrictions = []
        dietary_restrictions_names_json = self.request.data.get(
            'dietary_restrictions_names')
        if dietary_restrictions_names_json is not None:
            dietary_restrictions_names = json.loads(
                dietary_restrictions_names_json)
            for dr in dietary_restrictions_names:
                dietary_restrictions.append(get_object_or_404(
                    DietaryRestriction, name=dr))
            serializer.instance.dietary_restrictions.set(dietary_restrictions)
        serializer.save()


class ItemDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = EventItemSerializer
    permission_classes = [ItemDetailPermission]

    def perform_update(self, serializer):
        dietary_restrictions = []
        dietary_restrictions_names_json = self.request.data.get(
            'dietary_restrictions_names')
        if dietary_restrictions_names_json is not None:
            dietary_restrictions_names = json.loads(
                dietary_restrictions_names_json)
            for dr in dietary_restrictions_names:
                dietary_restrictions.append(get_object_or_404(
                    DietaryRestriction, name=dr))
            serializer.instance.dietary_restrictions.set(dietary_restrictions)
        serializer.save()


class ReserveItem(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = EventItemSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(Item, pk=pk)
        return obj

    def perform_update(self, serializer):
        item = get_object_or_404(Item, pk=self.kwargs["pk"])
        if self.request.user == item.owner:
            serializer.save(owner=None)
        elif item.owner is None:
            serializer.save(owner=self.request.user)
        elif item.owner != self.request.user and item.owner is not None:
            raise PermissionDenied()
        else:
            serializer.save()


class ListCreatePost(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [ItemPostInvitationGuest | ItemPostInvitationHost]

    def get_queryset(self):
        event_pk = self.kwargs['pk']
        return Post.objects.filter(event_id=event_pk)

    def perform_create(self, serializer):
        event = get_object_or_404(Event, pk=self.kwargs["pk"])
        author = self.request.user
        serializer.save(event=event, author=author)


class DeletePost(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsPostAuthorOrHost]


class ListCreateInvitations(generics.ListCreateAPIView):
    serializer_class = InvitationSerializer

    def get_queryset(self):
        event_pk = self.kwargs['pk']
        return Invitation.objects.filter(event_id=event_pk)

    def perform_create(self, serializer):
        email = self.request.data.get('email')
        event = get_object_or_404(Event, pk=self.kwargs["pk"])
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            serializer.save(guest=user, event=event)
        else:
            serializer.save(event=event)

        send(f"{event.host.full_name} invited you to an event!",
             f"Hello! You've been invited to an event on {event.date_scheduled} at {event.time_scheduled}. The event is called {event.title}. Sign up for potluck and view your invitation at www.potluck-events.netlify.com/invitations", [email])

    def get_permissions(self):
        if self.request.method != 'GET':
            return [ItemPostInvitationHost()]
        else:
            return [ItemPostInvitationGuest() | ItemPostInvitationHost()]


class CreateInvitationFromCode(generics.CreateAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        event_code = self.kwargs['code']
        event = get_object_or_404(Event, invite_code=event_code)
        guest = self.request.user
        email = guest.email

        serializer.save(event=event, guest=guest, email=email, response=None)


class InvitationDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invitation.objects.all()
    serializer_class = UserInvitationSerializer
    permission_classes = [InvitationDetailPermission]


class GetUserInfo(generics.ListAPIView):
    serializer_class = UserSerializerShort
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(email=self.kwargs["email"])

        return queryset


class ListDietaryRestrictions(generics.ListAPIView):
    serializer_class = DietaryRestrictionSerializer
    queryset = DietaryRestriction.objects.all()


class UserNotifications(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(recipient=user)
        return queryset


@receiver(post_save, sender=Invitation)
def create_invitation_notification(sender, instance, **kwargs):
    if kwargs.get('created', False):
        recipient = instance.guest
        header = f'New Invitation!'
        message = f'You have been invited to {instance.event.title} by {instance.event.host}!'
        Notification.objects.create(
            recipient=recipient, header=header, message=message)


@receiver(post_save, sender=Invitation)
def create_rsvp_notification(sender, instance, **kwargs):
    if not kwargs.get('created', False):
        if instance.response is not None:
            recipient = instance.event.host
            header = f'New RSVP!'
            if instance.response == True:
                message = f'{instance.guest} has accepted your invitation to {instance.event.title}!'
            else:
                message = f'{instance.guest} has declined your invitation to {instance.event.title}.'
            Notification.objects.create(
                recipient=recipient, header=header, message=message)
