from rest_framework import serializers
from .models import Page, FAQ


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ["id", "title", "slug", "content", "is_published", "updated_at"]
        read_only_fields = ["updated_at"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order", "is_active", "updated_at"]
        read_only_fields = ["updated_at"]
