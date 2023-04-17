from rest_framework import serializers
from .models import User, Event, Invitation, Item, Post


class EventSerializer(serializers.ModelSerializer):

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
