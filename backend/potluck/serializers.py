from django.utils import timezone
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


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'username',
            'first_name',
            'last_name',
            'nickname',
            'email',
            'phone_number',
            'city',
            'thumbnail',
            'date_joined',
        )

        read_only_fields = ('date_joined',)


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

    def validate_date_scheduled(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                'date_scheduled cannot be a past date')
        return value


class ItemSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)

    class Meta:
        model = Item
        fields = (
            'pk',
            'title',
            'description',
            'event',
            'owner',
        )
