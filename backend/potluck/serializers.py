from rest_framework import serializers
from .models import User, Event, Invitation, Item, Post


class EventSerializer(serializers.ModelSerializer):
    # host = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = Event
        fields = (
            'pk',
            'title',
            'theme',
            'description',
            'location_name',
            'street_address',
            'city',
            'state',
            'zipcode',
            'date_scheduled',
            'time_scheduled',
            'host',
        )

        read_only_fields = ('host',)


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = (
            'pk',
            'title',
            'description',
            'event',
            'owner',
        )
