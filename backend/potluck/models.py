from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.constraints import UniqueConstraint
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    name = models.CharField(max_length=50)
    nickname = models.CharField(max_length=50, blank=True, null=True)
    thumbnail = models.ImageField(blank=True, null=True)
    phone_number = PhoneNumberField(blank=True, null=True, unique=True)
    # email already included with AbstractUser?
    city = models.CharField(max_length=50)


class Event(models.Model):
    title = models.CharField(max_length=50)
    theme = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(max_length=200)
    location_name = models.CharField(max_length=50)
    street_address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    host = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='host_of')


class Invitation(models.Model):
    event = models.ForeignKey(
        to='Event', on_delete=models.CASCADE, related_name='invitations')
    guest = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='invited_to')
    email = models.EmailField(max_length=100)
    response = models.BooleanField(null=True, default=None)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['event', 'guest'],
                name='invitation_constraints'
            )
        ]


class Item(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    event = models.ForeignKey(
        to='Event', on_delete=models.CASCADE, related_name='items')
    owner = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='items')


class Post(models.Model):
    text = models.TextField(max_length=200)
    author = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='posts')
    event = models.ForeignKey(
        to='Event', on_delete=models.CASCADE, related_name='posts')
