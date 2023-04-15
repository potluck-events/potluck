from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Event(models.Model):
    CHOICES = (
        ('', ''),
        ('alabama', 'AL'),
        ('alaska', 'AK'),
        ('arizona', 'AZ'),
        ('arkansas', 'AR'),
        ('american-samoa', 'AS'),
        ('california', 'CA'),
        ('colorado', 'CO'),
        ('connecticut', 'CT'),
        ('delaware', 'DE'),
        ('district-of-columbia', 'DC'),
        ('florida', 'FL'),
        ('georgia', 'GA'),
        ('guam', 'GU'),
        ('hawaii', 'HI'),
        ('idaho', 'ID'),
        ('illinois', 'IL'),
        ('indiana', 'IN'),
        ('iowa', 'IA'),
        ('kansas', 'KS'),
        ('kentucky', 'KY'),
        ('louisiana', 'LA'),
        ('maine', 'ME'),
        ('maryland', 'MD'),
        ('massachusetts', 'MA'),
        ('michigan', 'MI'),
        ('minnesota', 'MN'),
        ('mississippi', 'MS'),
        ('missouri', 'MO'),
        ('montana', 'MT'),
        ('nebraska', 'NE'),
        ('nevada', 'NV'),
        ('new-hampshire', 'NH'),
        ('new-jersey', 'NJ'),
        ('new-mexico', 'NM'),
        ('new-york', 'NY'),
        ('north-carolina', 'NC'),
        ('north-dakota', 'ND'),
        ('northern-mariana-islands', 'MP'),
        ('ohio', 'OH'),
        ('oklahoma', 'OK'),
        ('oregon', 'OR'),
        ('pennsylvania', 'PA'),
        ('puerto-rico', 'PR'),
        ('rhode-island', 'RI'),
        ('south-carolina', 'SC'),
        ('south-dakota', 'SD'),
        ('tennessee', 'TN'),
        ('texas', 'TX'),
        ('trust-territories', 'TT'),
        ('utah', 'UT'),
        ('vermont', 'VT'),
        ('virginia', 'VA'),
        ('virgin-islands', 'VI'),
        ('washington', 'WA'),
        ('west-virginia', 'WV'),
        ('wisconsin', 'WI'),
        ('wyoming', 'WY'),
    )

    title = models.CharField(max_length=50)
    theme = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    location_name = models.CharField(max_length=50)
    street_address = models.CharField(max_length=50)
    city = models.Charfield(max_length=50)
    state = models.Charfield(choices=CHOICES, max_length=2)
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
