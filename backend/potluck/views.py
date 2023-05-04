# python imports
import json

# django imports
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from django.utils import timezone

# third-party imports
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from dj_rest_auth.registration.views import RegisterView

# local app imports
from .email import send
from .models import (User,
                     DietaryRestriction,
                     Event, Invitation,
                     Item,
                     Post,
                     Notification)
from .permissions import (IsHost,
                          ItemDetailPermission,
                          IsPostAuthorOrHost,
                          IsGuest,
                          ItemPostInvitationHost,
                          ItemPostInvitationGuest,
                          InvitationDetailPermission,
                          IsRecipient)
from .serializers import (UserSerializer,
                          UserSerializerShort,
                          EventSerializer,
                          EventItemSerializer,
                          UserItemSerializer,
                          UserInvitationSerializer,
                          PostSerializer,
                          InvitationSerializer, DietaryRestrictionSerializer, NotificationSerializer,
                          CustomRegisterSerializer)


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
             f"Hello! You've been invited to an event on {event.date_scheduled} at {event.time_scheduled}. The event is called {event.title}. Sign up for potluck and view your invitation at bash-events.netlify.com/invitations", [email])

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

    def delete(self, request):
        user = request.user
        notifications = Notification.objects.filter(recipient=user)
        notifications.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReadUserNotifications(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(recipient=user)
        queryset.update(is_read=True)
        return queryset


class DeleteNotification(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsRecipient]


# notification to guest when they receive an invitation
@receiver(post_save, sender=Invitation)
def create_invitation_notification(sender, instance, **kwargs):
    if kwargs.get('created', False):
        if instance.guest is not None:
            recipient = instance.guest
            header = 'New Invitation!'
            message = f'You have been invited to {instance.event.title} by {instance.event.host}!'
            Notification.objects.create(
                recipient=recipient, header=header, message=message, event=instance.event)


# notification to host when guest responds to an invitation
@receiver(post_save, sender=Invitation)
def create_rsvp_notification(sender, instance, **kwargs):
    if not kwargs.get('created', False):
        if instance.response is not None:
            recipient = instance.event.host
            header = 'New RSVP!'
            if instance.response == True:
                message = f'{instance.guest} has accepted your invitation to {instance.event.title}!'
            else:
                message = f'{instance.guest} has declined your invitation to {instance.event.title}.'
            Notification.objects.create(
                recipient=recipient, header=header, message=message, event=instance.event)


# notify guests when host creates a new item
@receiver(post_save, sender=Item)
def create_host_item_notification(sender, instance, created, **kwargs):
    if created and instance.owner is None:
        event = instance.event
        for invitation in event.invitations.filter(response=True):
            guest = invitation.guest
            if guest:
                header = 'Up for Grabs!'
                message = f'{instance.event.host} needs someone to bring {instance.title} for {event.title}.'
                Notification.objects.create(
                    recipient=guest, header=header, message=message, event=event)


# notify host when a guest creates a new item
@receiver(post_save, sender=Item)
def create_item_notification_for_host(sender, instance, created, **kwargs):
    if created and instance.owner is not None:
        event = instance.event
        host = instance.event.host
        if host:
            header = 'Your event just got even better!'
            message = f'{instance.owner} is bringing {instance.title} to {event.title}!'
            Notification.objects.create(
                recipient=host, header=header, message=message, event=event)


# notification to host when guest 'grabs' or 'ungrabs' an item
@receiver(post_save, sender=Item)
def create_grab_notification_for_host(sender, instance, **kwargs):
    recipient = instance.event.host
    if not kwargs.get('created', False):
        if instance.owner is not None:
            header = 'A guest grabbed something for your event!'
            message = f'{instance.owner} is bringing {instance.title} to {instance.event.title}!'
        else:
            header = 'Up for Grabs!'
            message = f'A guest is no longer bringing {instance.title} to {instance.event.title}.'
        Notification.objects.create(
            recipient=recipient, header=header, message=message, event=instance.event)


# notify guests when an item is un-grabbed
@receiver(post_save, sender=Item)
def create_ungrab_item_notification_for_guests(sender, instance, **kwargs):
    event = instance.event
    if not kwargs.get('created', False):
        if instance.owner is None:
            for invitation in event.invitations.filter(response=True):
                guest = invitation.guest
                if guest:
                    header = 'Up for Grabs!'
                    message = f'{instance.event.host} needs someone to bring {instance.title} for {event.title}.'
                    Notification.objects.create(
                        recipient=guest, header=header, message=message, event=event)


# notify owner of an item when item is deleted
@receiver(pre_delete, sender=Item)
def delete_item_notification_for_owner(sender, instance, **kwargs):
    if instance.owner is not None:
        event = instance.event
        recipient = instance.owner
        header = "You're off the hook!"
        message = f"You don't need to bring {instance.title} to {event.title}."
        Notification.objects.create(
            recipient=recipient, header=header, message=message, event=event)


# notify host when an item is deleted
@receiver(pre_delete, sender=Item)
def delete_item_notification_for_host(sender, instance, **kwargs):
    event = instance.event
    host = event.host
    header = "An item was removed from your event."
    message = f"{instance} has been deleted."
    Notification.objects.create(
        recipient=host, header=header, message=message, event=event)


# notify host when a post is made
@receiver(post_save, sender=Post)
def create_post_notification_for_host(sender, instance, **kwargs):
    event = instance.event
    host = event.host
    header = 'New Post!'
    message = f'{instance.author} posted a message in {instance.event.title}!'
    Notification.objects.create(
        recipient=host, header=header, message=message, event=event)


# notify guests when a post is made
@receiver(post_save, sender=Post)
def create_post_notification_for_guests(sender, instance, created, **kwargs):
    if created:
        event = instance.event
        for invitation in event.invitations.filter(response=True):
            guest = invitation.guest
            if guest:
                header = 'New Post!'
                message = f'{instance.author} posted a message in {instance.event.title}!'
                Notification.objects.create(
                    recipient=guest, header=header, message=message, event=event)


# notify guest when a host deletes their invitation
@receiver(pre_delete, sender=Invitation)
def delete_invitation_notification_for_guest(sender, instance, **kwargs):
    event = instance.event
    recipient = instance.guest
    header = "Invitation Canceled"
    message = f'Your invitation to {event.title} has been deleted by the host.'
    Notification.objects.create(
        recipient=recipient, header=header, message=message, event=event)


# notify guests when host deletes event
@receiver(pre_delete, sender=Event)
def delete_event_notification_for_guest(sender, instance, **kwargs):
    event = instance
    for invitation in event.invitations.all():
        guest = invitation.guest
        if guest:
            header = 'Event Canceled'
            message = f'{event.title} has been canceled by the host.'
            Notification.objects.create(
                recipient=guest, header=header, message=message)
