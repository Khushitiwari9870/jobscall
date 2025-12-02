from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class SubscriptionPlan(models.Model):
    """Model to store different subscription plans"""
    name = models.CharField(_('Plan Name'), max_length=100)
    slug = models.SlugField(_('Slug'), max_length=100, unique=True)
    description = models.TextField(_('Description'), blank=True)
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(
        _('Billing Cycle'),
        max_length=20,
        choices=[
            ('monthly', 'Monthly'),
            ('quarterly', 'Quarterly'),
            ('yearly', 'Yearly'),
            ('lifetime', 'Lifetime'),
        ],
        default='monthly'
    )
    is_active = models.BooleanField(_('Is Active'), default=True)
    features = models.JSONField(_('Features'), default=dict, blank=True)
    max_job_postings = models.PositiveIntegerField(_('Max Job Postings'), default=5)
    max_candidate_views = models.PositiveIntegerField(_('Max Candidate Views'), default=100)
    max_resume_downloads = models.PositiveIntegerField(_('Max Resume Downloads'), default=50)
    max_team_members = models.PositiveIntegerField(_('Max Team Members'), default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Subscription Plan')
        verbose_name_plural = _('Subscription Plans')
        ordering = ['price']

    def __str__(self):
        return f"{self.name} ({self.get_billing_cycle_display()}) - ${self.price}"


class UserSubscription(models.Model):
    """Model to track user subscriptions"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('canceled', 'Canceled'),
        ('expired', 'Expired'),
        ('trial', 'Trial'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subscription',
        verbose_name=_('User')
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.SET_NULL,
        null=True,
        related_name='subscribers',
        verbose_name=_('Plan')
    )
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='trial'
    )
    start_date = models.DateTimeField(_('Start Date'), default=timezone.now)
    end_date = models.DateTimeField(_('End Date'), null=True, blank=True)
    is_auto_renew = models.BooleanField(_('Auto Renew'), default=True)
    stripe_subscription_id = models.CharField(
        _('Stripe Subscription ID'),
        max_length=100,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('User Subscription')
        verbose_name_plural = _('User Subscriptions')

    def __str__(self):
        return f"{self.user.email} - {self.plan.name if self.plan else 'No Plan'}"

    @property
    def is_active(self):
        return self.status == 'active' and (
            self.end_date is None or self.end_date > timezone.now()
        )


class UsageRecord(models.Model):
    """Model to track usage of different features"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='usage_records',
        verbose_name=_('User')
    )
    feature = models.CharField(
        _('Feature'),
        max_length=50,
        choices=[
            ('job_postings', 'Job Postings'),
            ('candidate_views', 'Candidate Profile Views'),
            ('resume_downloads', 'Resume Downloads'),
            ('team_members', 'Team Members'),
        ]
    )
    usage_count = models.PositiveIntegerField(_('Usage Count'), default=0)
    reset_date = models.DateField(_('Reset Date'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Usage Record')
        verbose_name_plural = _('Usage Records')
        unique_together = ('user', 'feature', 'reset_date')
        ordering = ['-reset_date', 'user', 'feature']

    def __str__(self):
        return f"{self.user.email} - {self.get_feature_display()}: {self.usage_count}"


class BillingHistory(models.Model):
    """Model to track billing history"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='billing_history',
        verbose_name=_('User')
    )
    subscription = models.ForeignKey(
        UserSubscription,
        on_delete=models.CASCADE,
        related_name='billing_history',
        verbose_name=_('Subscription')
    )
    amount = models.DecimalField(_('Amount'), max_digits=10, decimal_places=2)
    currency = models.CharField(_('Currency'), max_length=3, default='USD')
    payment_status = models.CharField(
        _('Payment Status'),
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )
    payment_date = models.DateTimeField(_('Payment Date'), null=True, blank=True)
    invoice_url = models.URLField(_('Invoice URL'), blank=True)
    stripe_payment_intent_id = models.CharField(
        _('Stripe Payment Intent ID'),
        max_length=100,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Billing History')
        verbose_name_plural = _('Billing History')
        ordering = ['-payment_date', '-created_at']

    def __str__(self):
        return f"{self.user.email} - ${self.amount} - {self.get_payment_status_display()}"


class CreditPackage(models.Model):
    """Model for credit packages that users can purchase"""
    name = models.CharField(_('Package Name'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    credits = models.PositiveIntegerField(_('Number of Credits'))
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Credit Package')
        verbose_name_plural = _('Credit Packages')
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - {self.credits} credits (${self.price})"


class UserCredits(models.Model):
    """Model to track user credits"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='credits',
        verbose_name=_('User')
    )
    balance = models.PositiveIntegerField(_('Balance'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('User Credits')
        verbose_name_plural = _('User Credits')

    def __str__(self):
        return f"{self.user.email} - {self.balance} credits"

    def add_credits(self, amount, source='purchase', reference_id=None):
        """Add credits to user's balance"""
        self.balance += amount
        self.save(update_fields=['balance', 'updated_at'])
        
        # Record the transaction
        CreditTransaction.objects.create(
            user=self.user,
            amount=amount,
            transaction_type='credit',
            source=source,
            reference_id=reference_id,
            balance_after=self.balance
        )
        return self.balance

    def use_credits(self, amount, source='usage', reference_id=None):
        """Use credits from user's balance"""
        if self.balance < amount:
            raise ValueError("Insufficient credits")
            
        self.balance -= amount
        self.save(update_fields=['balance', 'updated_at'])
        
        # Record the transaction
        CreditTransaction.objects.create(
            user=self.user,
            amount=amount,
            transaction_type='debit',
            source=source,
            reference_id=reference_id,
            balance_after=self.balance
        )
        return self.balance


class CreditTransaction(models.Model):
    """Model to track credit transactions"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='credit_transactions',
        verbose_name=_('User')
    )
    user_credits = models.ForeignKey(
        'UserCredits',
        on_delete=models.CASCADE,
        related_name='transactions',
        verbose_name=_('User Credits')
    )
    amount = models.PositiveIntegerField(_('Amount'))
    transaction_type = models.CharField(
        _('Transaction Type'),
        max_length=10,
        choices=[
            ('credit', 'Credit'),
            ('debit', 'Debit'),
        ]
    )
    source = models.CharField(
        _('Source'),
        max_length=50,
        help_text="Source of the transaction (e.g., 'purchase', 'job_posting', 'resume_download')"
    )
    reference_id = models.CharField(
        _('Reference ID'),
        max_length=100,
        blank=True,
        null=True,
        help_text="Reference to the related object (e.g., job ID, package ID)"
    )
    balance_after = models.IntegerField(_('Balance After'))
    notes = models.TextField(_('Notes'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Credit Transaction')
        verbose_name_plural = _('Credit Transactions')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.get_transaction_type_display()}: {self.amount} credits (Balance: {self.balance_after})"

    def save(self, *args, **kwargs):
        # If user_credits is not set, try to get it from the user
        if not hasattr(self, 'user_credits') or not self.user_credits:
            self.user_credits = self.user.credits
        super().save(*args, **kwargs)
