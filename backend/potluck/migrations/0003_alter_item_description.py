# Generated by Django 4.2 on 2023-04-18 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('potluck', '0002_rename_date_event_date_scheduled_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='description',
            field=models.TextField(blank=True, max_length=200, null=True),
        ),
    ]
