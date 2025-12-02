from rest_framework import serializers
from .models import Plan, Price, Invoice, PaymentIntent


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "name", "description", "created_at"]
        read_only_fields = ["created_at"]


class PriceSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source="plan.name", read_only=True)

    class Meta:
        model = Price
        fields = ["id", "plan", "plan_name", "amount", "currency", "interval", "active"]


class InvoiceSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Invoice
        fields = [
            "id",
            "user",
            "username",
            "amount",
            "currency",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "username"]


class PaymentIntentSerializer(serializers.ModelSerializer):
    invoice_id = serializers.IntegerField(source="invoice.id", read_only=True)

    class Meta:
        model = PaymentIntent
        fields = [
            "id",
            "invoice",
            "invoice_id",
            "provider",
            "provider_ref",
            "status",
            "client_secret",
            "created_at",
        ]
        read_only_fields = ["created_at", "invoice_id"]

    def validate_invoice(self, value: Invoice):
        request = self.context.get("request")
        if request and request.user and value.user_id != request.user.id:
            raise serializers.ValidationError("You can only create payment intents for your own invoices.")
        return value
