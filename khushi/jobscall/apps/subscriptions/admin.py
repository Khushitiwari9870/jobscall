from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from .models import (
    SubscriptionPlan, UserSubscription, UsageRecord,
    BillingHistory, CreditPackage, UserCredits, CreditTransaction
)


class UsageRecordInline(admin.TabularInline):
    model = UsageRecord
    extra = 0
    readonly_fields = ('user', 'feature', 'usage_count', 'reset_date', 'created_at')
    can_delete = False
    max_num = 0
    show_change_link = True
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'billing_cycle', 'is_active', 'created_at')
    list_filter = ('is_active', 'billing_cycle')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description', 'is_active')
        }),
        (_('Pricing'), {
            'fields': ('price', 'billing_cycle')
        }),
        (_('Limits'), {
            'fields': (
                'max_job_postings',
                'max_candidate_views',
                'max_resume_downloads',
                'max_team_members',
            )
        }),
        (_('Features'), {
            'fields': ('features',),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
        }),
    )
    prepopulated_fields = {'slug': ('name',)}


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'start_date', 'end_date', 'is_auto_renew', 'is_active')
    list_filter = ('status', 'is_auto_renew', 'plan')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'stripe_subscription_id')
    readonly_fields = ('created_at', 'updated_at', 'is_active')
    fieldsets = (
        (None, {
            'fields': ('user', 'plan', 'status')
        }),
        (_('Dates'), {
            'fields': ('start_date', 'end_date', 'is_auto_renew')
        }),
        (_('Payment'), {
            'fields': ('stripe_subscription_id',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(boolean=True)
    def is_active(self, obj):
        return obj.status == 'active' and (obj.end_date is None or obj.end_date > timezone.now())

@admin.register(UsageRecord)
class UsageRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'feature', 'usage_count', 'reset_date')
    list_filter = ('feature', 'reset_date')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'reset_date'


@admin.register(BillingHistory)
class BillingHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscription', 'amount', 'currency', 'payment_status', 'payment_date')
    list_filter = ('payment_status', 'currency', 'payment_date')
    search_fields = ('user__email', 'stripe_payment_intent_id')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'payment_date'


@admin.register(CreditPackage)
class CreditPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'credits', 'is_active', 'price_per_credit')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    def price_per_credit(self, obj):
        if obj.credits > 0:
            return f"${(obj.price / obj.credits):.2f}"
        return "N/A"
    price_per_credit.short_description = _('Price per Credit')


class CreditTransactionInline(admin.StackedInline):
    model = CreditTransaction
    extra = 0
    readonly_fields = ('transaction_type', 'amount', 'source', 'reference_id', 'balance_after', 'created_at')
    can_delete = False
    max_num = 10
    ordering = ('-created_at',)

@admin.register(UserCredits)
class UserCreditsAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'updated_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [CreditTransactionInline]
    fieldsets = (
        (None, {
            'fields': ('user', 'balance')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CreditTransaction)
class CreditTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'transaction_type', 'source', 'balance_after', 'created_at')
    list_filter = ('transaction_type', 'source', 'created_at')
    search_fields = ('user__email', 'reference_id', 'notes')
    readonly_fields = ('created_at', 'balance_after')
    date_hierarchy = 'created_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
