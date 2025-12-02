from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()

class Folder(models.Model):
    """Model to store user-created folders for organizing profiles"""
    name = models.CharField(_('Folder Name'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='folders',
        verbose_name=_('Created By')
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    is_default = models.BooleanField(_('Is Default Folder'), default=False)
    
    class Meta:
        verbose_name = _('Folder')
        verbose_name_plural = _('Folders')
        ordering = ['name']
        unique_together = ['name', 'created_by']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Ensure only one default folder per user
        if self.is_default:
            Folder.objects.filter(created_by=self.created_by, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class FolderProfile(models.Model):
    """Model to track which profiles are in which folders"""
    folder = models.ForeignKey(
        Folder,
        on_delete=models.CASCADE,
        related_name='folder_profiles',
        verbose_name=_('Folder')
    )
    profile = models.ForeignKey(
        'profile.UserProfile',
        on_delete=models.CASCADE,
        related_name='profile_folders',
        verbose_name=_('Profile')
    )
    added_at = models.DateTimeField(_('Added At'), auto_now_add=True)
    added_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='added_folder_profiles',
        verbose_name=_('Added By')
    )
    notes = models.TextField(_('Notes'), blank=True)
    
    class Meta:
        verbose_name = _('Folder Profile')
        verbose_name_plural = _('Folder Profiles')
        unique_together = ['folder', 'profile']
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.profile} in {self.folder}"
