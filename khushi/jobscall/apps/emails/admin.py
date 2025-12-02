from django.contrib import admin
from .models import EmailTemplate, EmailCampaign, EmailRecipient, EmailLog


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'template_type', 'is_active', 'created_at')
    list_filter = ('template_type', 'is_active', 'created_at')
    search_fields = ('name', 'subject', 'body')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'subject', 'body', 'template_type', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class EmailLogInline(admin.TabularInline):
    model = EmailLog
    extra = 0
    readonly_fields = ('subject', 'recipient', 'status', 'sent_at')
    can_delete = False
    show_change_link = True


@admin.register(EmailCampaign)
class EmailCampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'template', 'status', 'scheduled_time', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'template__name')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [EmailLogInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'template', 'status', 'scheduled_time')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EmailRecipient)
class EmailRecipientAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ('subject', 'recipient_email', 'status', 'sent_at')
    list_filter = ('status', 'sent_at')
    search_fields = ('subject', 'recipient__email', 'message_id')
    readonly_fields = (
        'campaign', 'recipient', 'subject', 'status', 'sent_at',
        'delivered_at', 'opened_at', 'error_message', 'message_id'
    )
    
    def recipient_email(self, obj):
        return obj.recipient.email
    recipient_email.short_description = 'Recipient'
