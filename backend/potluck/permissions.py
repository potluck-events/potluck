from rest_framework import permissions


class IsHost(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.host:
            return True
        return False

    def __or__(self, other):
        return OrPermission(self, other)


class IsGuest(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        # breakpoint()
        if obj.invitations.filter(guest=request.user).exists():
            return True
        return False


class ItemDetailPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method != 'GET':
            return request.user == obj.created_by or request.user == obj.event.host
        return True


class OrPermission(permissions.BasePermission):
    def __init__(self, *permissions):
        self.permissions = permissions

    def has_permission(self, request, view):
        return any(perm.has_permission(request, view) for perm in self.permissions)

    def has_object_permission(self, request, view, obj):
        return any(perm.has_object_permission(request, view, obj) for perm in self.permissions)
