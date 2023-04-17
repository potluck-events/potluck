from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework import serializers
from .models import User, Event, Invitation, Item, Post


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    def custom_signup(self, request, user):
        user.first_name = self.validated_data['first_name']
        user.last_name = self.validated_data['last_name']
        user.save(update_fields=['first_name', 'last_name'])


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
