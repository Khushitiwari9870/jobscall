from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings

from .models import RecruiterProfile, RecruiterMembership, RecruiterActivity


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_recruiter_profile(sender, instance, created, **kwargs):
    """
    Create a recruiter profile when a new user is created with the recruiter role
    """
    if created and hasattr(instance, 'is_recruiter') and instance.is_recruiter:
        RecruiterProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=RecruiterProfile)
def create_recruiter_membership(sender, instance, created, **kwargs):
    """
    Create a default membership when a new recruiter profile is created
    """
    if created:
        RecruiterMembership.objects.get_or_create(
            recruiter=instance,
            defaults={
                'tier': 'basic',
                'job_postings_remaining': 1,
                'candidate_views_remaining': 10,
                'can_contact_candidates': False,
                'can_use_ats': False,
                'is_active': True
            }
        )


@receiver(pre_save, sender=RecruiterMembership)
def handle_membership_expiry(sender, instance, **kwargs):
    """
    Handle membership expiry and renewal
    """
    if instance.pk:
        try:
            old_instance = RecruiterMembership.objects.get(pk=instance.pk)
            
            # If tier was upgraded
            if old_instance.tier != instance.tier and instance.tier != 'basic':
                # Reset usage limits based on the new tier
                if instance.tier == 'professional':
                    instance.job_postings_remaining = 10
                    instance.candidate_views_remaining = 100
                    instance.can_contact_candidates = True
                    instance.can_use_ats = True
                elif instance.tier == 'enterprise':
                    instance.job_postings_remaining = 100  # Unlimited
                    instance.candidate_views_remaining = 1000  # Unlimited
                    instance.can_contact_candidates = True
                    instance.can_use_ats = True
                
                # Log the membership upgrade
                RecruiterActivity.objects.create(
                    recruiter=instance.recruiter,
                    activity_type='membership_upgrade',
                    details={
                        'from_tier': old_instance.tier,
                        'to_tier': instance.tier,
                        'job_postings_remaining': instance.job_postings_remaining,
                        'candidate_views_remaining': instance.candidate_views_remaining
                    }
                )
            
            # If membership was renewed
            if not old_instance.is_active and instance.is_active:
                # Reset expiry date (e.g., 1 year from now)
                instance.expires_at = timezone.now() + timezone.timedelta(days=365)
                
                # Log the membership renewal
                RecruiterActivity.objects.create(
                    recruiter=instance.recruiter,
                    activity_type='membership_renewal',
                    details={
                        'expires_at': instance.expires_at.isoformat(),
                        'tier': instance.tier
                    }
                )
                
        except RecruiterMembership.DoesNotExist:
            pass  # New instance, nothing to do


@receiver(post_save, sender=RecruiterMembership)
def update_recruiter_status(sender, instance, **kwargs):
    """
    Update the recruiter's active status based on their membership
    """
    recruiter = instance.recruiter
    if recruiter.is_active != instance.is_active:
        recruiter.is_active = instance.is_active
        recruiter.save(update_fields=['is_active'])
        
        # Log the status change
        RecruiterActivity.objects.create(
            recruiter=recruiter,
            activity_type='account_status_change',
            details={
                'status': 'active' if instance.is_active else 'inactive',
                'reason': 'membership_change'
            }
        )
