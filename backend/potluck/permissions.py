from rest_framework import permissions
from django.shortcuts import get_object_or_404
from .models import Event


class IsHost(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        return obj.host == request.user

    def __or__(self, other):
        return OrPermission(self, other)


class IsGuest(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        return obj.invitations.filter(guest=request.user).exists()


class ItemDetailPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method != 'GET':
            return request.user == obj.created_by or request.user == obj.event.host
        return True


class ItemPostInvitationHost(permissions.BasePermission):

    def has_permission(self, request, view):
        kwargs = view.kwargs
        event_pk = kwargs.get('pk')
        event = Event.objects.get(pk=event_pk)
        return request.user == event.host

    def __or__(self, other):
        return OrPermission(self, other)


class ItemPostInvitationGuest(permissions.BasePermission):

    def has_permission(self, request, view):
        kwargs = view.kwargs
        event_pk = kwargs.get('pk')
        event = Event.objects.get(pk=event_pk)
        return event.invitations.filter(guest=request.user).exists()

    def __or__(self, other):
        return OrPermission(self, other)


class IsPostAuthorOrHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.author or request.user == obj.event.host:
            return True
        return False


class OrPermission(permissions.BasePermission):
    def __init__(self, *permissions):
        self.permissions = permissions

    def has_permission(self, request, view):
        return any(perm.has_permission(request, view) for perm in self.permissions)

    def has_object_permission(self, request, view, obj):
        return any(perm.has_object_permission(request, view, obj) for perm in self.permissions)
