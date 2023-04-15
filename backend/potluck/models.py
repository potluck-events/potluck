from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Event(models.Model):
    title = models.CharField(max_length=50)
    theme = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    location_name = models.CharField(max_length=50)
    street_address = models.CharField(max_length=50)
    city = models.Charfield(max_length=50)
    state = models.Charfield(max_length=2)
    zipcode = models.Charfield(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    host = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='host_of')


class Invitation(models.Model):
    pass


class EventItem(models.Model):
    pass


class Post(models.Model):
    pass
