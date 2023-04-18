from rest_framework import permissions


class IsHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.host:
            return True
        return False


class IsItemHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.event.host:
            return True
        return False
