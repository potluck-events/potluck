from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.constraints import UniqueConstraint
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    nickname = models.CharField(max_length=50, blank=True, null=True)
    thumbnail = models.ImageField(
        upload_to='thumbnails', blank=True, null=True)
    phone_number = PhoneNumberField(blank=True, null=True, unique=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    initials = models.CharField(max_length=3, blank=True)
    full_name = models.CharField(max_length=61, blank=True)
    dietary_restrictions = models.ManyToManyField(
        to='DietaryRestriction', blank=True, null=True)

    def save(self, *args, **kwargs):
        self.initials = "".join(
            [name[0] for name in self.first_name.split() + self.last_name.split()])
        self.full_name = "{} {}".format(self.first_name, self.last_name)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)


class DietaryRestriction(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=50)
    theme = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(max_length=3000)
    location_name = models.CharField(max_length=50)
    street_address = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=2, blank=True, null=True)
    zipcode = models.CharField(max_length=20, blank=True, null=True)
    date_scheduled = models.DateField()
    time_scheduled = models.TimeField()
    host = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='host_of')

    class Meta:
        ordering = ['-date_scheduled']

    def __str__(self):
        return f'{self.title} hosted by {self.host}'


class Invitation(models.Model):
    event = models.ForeignKey(
        to='Event', on_delete=models.CASCADE, related_name='invitations')
    guest = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='invited_to', blank=True, null=True)
    email = models.EmailField(max_length=100)
    response = models.BooleanField(null=True, default=None)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['event', 'email'],
                name='invitation_constraints'
            )
        ]

    def __str__(self):
        return f"{self.guest}'s invitation to {self.event}"


class Item(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=200, blank=True, null=True)
    event = models.ForeignKey(
        to='Event', on_delete=models.CASCADE, related_name='items')
    created_by = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='creator')
    owner = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='items', blank=True, null=True)
    time_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-time_created']

    def __str__(self):
        return f'{self.title} for {self.event}'


class Post(models.Model):
    text = models.TextField(max_length=1000)
    author = models.ForeignKey(
        to='User', on_delete=models.CASCADE, related_name='posts')
    event = models.ForeignKey(
        to='Event', on_delete=models.CASCADE, related_name='posts')
    time_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-time_created']

    def __str__(self):
        return f'Post for {self.event} by {self.author}'
