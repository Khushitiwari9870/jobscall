from django import template
from django.utils.safestring import mark_safe

register = template.Library()


def _add_attr(field, attr_name: str, attr_value: str):
    existing = field.field.widget.attrs.get(attr_name, "").strip()
    merged = (existing + " " + attr_value).strip() if existing else attr_value
    field.field.widget.attrs[attr_name] = merged
    return field


@register.filter(name="add_class")
def add_class(field, css: str):
    """Append CSS classes to a bound field's widget."""
    return _add_attr(field, "class", css)


@register.filter(name="add_attr")
def add_attr(field, arg: str):
    """Generic attribute adder: usage {{ field|add_attr:"placeholder:Your name" }}"""
    try:
        name, value = arg.split(":", 1)
    except ValueError:
        return field
    return _add_attr(field, name, value)
