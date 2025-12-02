""
Custom permissions for the authx app.
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    ""
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user


class IsAdminUser(permissions.BasePermission):
    ""
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class IsEmployer(permissions.BasePermission):
    ""
    Allows access only to employer users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            hasattr(request.user, 'profile') and 
            request.user.profile.user_type == 'employer'
        )


class IsCandidate(permissions.BasePermission):
    ""
    Allows access only to candidate users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            hasattr(request.user, 'profile') and 
            request.user.profile.user_type == 'candidate'
        )


class IsOwner(permissions.BasePermission):
    ""
    Object-level permission to only allow owners of an object to access it.
    Assumes the model instance has a `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named 'user'.
        return obj.user == request.user
