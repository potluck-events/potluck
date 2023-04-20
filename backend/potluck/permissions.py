from rest_framework import permissions


class IsHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.host:
            return True
        return False


class ItemDetailPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method != 'GET':
            return request.user == obj.created_by or request.user == obj.event.host
        return True


# class IsAttending(permissions.BasePermission):

#     def has_object_permission(self, request, view, obj):
#         if request.user == obj.host or request.user == obj.invitations__guest:
#             return True
#         return False
