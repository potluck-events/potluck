from collections import Counter
from django.shortcuts import get_object_or_404
from django.utils import timezone
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import User, DietaryRestriction, Event, Invitation, Item, Post
from itertools import chain


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    thumbnail = serializers.ImageField(required=False)

    def custom_signup(self, request, user):
        user.first_name = self.validated_data['first_name']
        user.last_name = self.validated_data['last_name']
        user.thumbnail = self.validated_data['thumbnail']
        user.save(update_fields=['first_name', 'last_name'])


class DietaryRestrictionSerializer(serializers.ModelSerializer):

    class Meta:
        model = DietaryRestriction
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):

    dietary_restrictions_names = serializers.StringRelatedField(
        many=True,
        source='dietary_restrictions',
        read_only=True
    )

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
            'date_joined',
            'full_name',
            'initials',
            'thumbnail',
            'dietary_restrictions',
            'dietary_restrictions_names',
        )

        read_only_fields = ('date_joined',)


class UserSerializerShort(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'full_name',
            'initials',
            'email',
            'thumbnail',
        )

        read_only_fields = ('date_joined',)


class EventItemSerializer(serializers.ModelSerializer):
    user_is_creator = serializers.SerializerMethodField()
    user_is_owner = serializers.SerializerMethodField()
    owner = UserSerializerShort(read_only=True, many=False)

    def get_user_is_creator(self, obj):
        return obj.created_by == self.context['request'].user

    def get_user_is_owner(self, obj):
        return obj.owner == self.context['request'].user

    class Meta:
        model = Item
        fields = (
            'pk',
            'title',
            'description',
            'created_by',
            'owner',
            'user_is_creator',
            'user_is_owner',
        )

        read_only_fields = (
            'created_by',
            'user_is_creator',
            'user_is_owner',
            'owner',
        )


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializerShort(many=False, read_only=True)
    user_is_author = serializers.SerializerMethodField()

    def get_user_is_author(self, obj):
        return obj.author == self.context['request'].user

    class Meta:
        model = Post
        fields = "__all__"

        read_only_fields = ('event',)


class EventSerializer(serializers.ModelSerializer):
    host = UserSerializerShort(many=False, read_only=True)
    items = EventItemSerializer(many=True, read_only=True)
    posts = PostSerializer(many=True, read_only=True)

    count_invited = serializers.SerializerMethodField()
    rsvp_yes = serializers.SerializerMethodField()
    rsvp_no = serializers.SerializerMethodField()
    rsvp_tbd = serializers.SerializerMethodField()

    user_is_host = serializers.SerializerMethodField()
    user_is_guest = serializers.SerializerMethodField()
    user_response = serializers.SerializerMethodField()

    invitation_pk = serializers.SerializerMethodField()
    dietary_restrictions_count = serializers.SerializerMethodField()

    def get_count_invited(self, obj):
        return obj.invitations.count()

    def get_rsvp_yes(self, obj):
        return obj.invitations.filter(response=True).count()

    def get_rsvp_no(self, obj):
        return obj.invitations.filter(response=False).count()

    def get_rsvp_tbd(self, obj):
        return obj.invitations.filter(response=None).count()

    def get_user_is_host(self, obj):
        return obj.host == self.context['request'].user

    def get_user_is_guest(self, obj):
        return obj.invitations.filter(guest=self.context['request'].user).exists()

    def get_user_response(self, obj):
        if obj.invitations.filter(guest=self.context['request'].user).exists():
            return obj.invitations.get(guest=self.context['request'].user).response
        return None

    def get_invitation_pk(self, obj):
        if obj.invitations.filter(guest=self.context['request'].user).exists():
            return obj.invitations.get(guest=self.context['request'].user).pk
        return None

    def get_dietary_restrictions_count(self, obj):
        guests = obj.invitations.filter(response=True).values_list(
            'guest__dietary_restrictions__name', flat=True)
        host = User.objects.filter(pk=obj.host.pk).values_list(
            'dietary_restrictions__name', flat=True)
        users = chain(host, guests)
        counter = Counter(users)

        return dict(counter)

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
            'count_invited',
            'rsvp_yes',
            'rsvp_no',
            'rsvp_tbd',
            'user_is_host',
            'user_is_guest',
            'user_response',
            'items',
            'posts',
            'invitation_pk',
            'dietary_restrictions_count',
        )

        read_only_fields = ('host',)

    def validate_date_scheduled(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                'date_scheduled cannot be a past date')
        return value


class EventSerializerShort(serializers.ModelSerializer):
    host = serializers.SlugRelatedField(
        read_only=True, slug_field='username')
    user_response = serializers.SerializerMethodField()
    invitation_pk = serializers.SerializerMethodField()

    def get_user_response(self, obj):
        if obj.invitations.filter(guest=self.context['request'].user).exists():
            return obj.invitations.get(guest=self.context['request'].user).response
        return None

    def get_invitation_pk(self, obj):
        if obj.invitations.filter(guest=self.context['request'].user).exists():
            return obj.invitations.get(guest=self.context['request'].user).pk
        return None

    class Meta:
        model = Event
        fields = (
            'pk',
            'title',
            'theme',
            'description',
            'location_name',
            'date_scheduled',
            'time_scheduled',
            'host',
            'user_response',
            'invitation_pk',
        )


class UserItemSerializer(serializers.ModelSerializer):
    event = EventSerializerShort(read_only=True, )

    class Meta:
        model = Item
        fields = (
            'pk',
            'title',
            'description',
            'event',
            'created_by',
            'owner',
        )

        read_only_fields = ('created_by',)


class UserInvitationSerializer(serializers.ModelSerializer):
    event = EventSerializer()
    host = serializers.SerializerMethodField()

    def get_host(self, obj):
        return f"{obj.event.host.first_name} {obj.event.host.last_name}"

    class Meta:
        model = Invitation
        fields = (
            'pk',
            'event',
            'host',
            'response',
        )

        read_only_fields = ('pk', 'event', 'host',)


class InvitationSerializer(serializers.ModelSerializer):
    guest = UserSerializerShort(many=False, read_only=True)

    class Meta:
        model = Invitation
        fields = ('guest',
                  'email',
                  'response',)

        read_only_fields = ('event',)
