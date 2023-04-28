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


class ItemDetailPermission(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        if request.method != 'GET':
            return request.user == obj.created_by or request.user == obj.event.host or request.user == obj.event.owner
        return True


class InvitationDetailPermission(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user == obj.guest or request.user == obj.event.host
        elif request.method == 'DELETE':
            return request.user == obj.event.host
        else:
            return request.user == obj.guest
        return True


class ItemPostInvitationHost(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        kwargs = view.kwargs
        event_pk = kwargs.get('pk')
        event = Event.objects.get(pk=event_pk)
        return request.user == event.host

    def __or__(self, other):
        return OrPermission(self, other)


class ItemPostInvitationGuest(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        kwargs = view.kwargs
        event_pk = kwargs.get('pk')
        event = Event.objects.get(pk=event_pk)
        return event.invitations.filter(guest=request.user).exists()

    def __or__(self, other):
        return OrPermission(self, other)


class IsPostAuthorOrHost(permissions.IsAuthenticated):

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
