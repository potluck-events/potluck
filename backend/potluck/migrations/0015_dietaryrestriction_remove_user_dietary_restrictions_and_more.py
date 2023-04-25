# Generated by Django 4.2 on 2023-04-24 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('potluck', '0014_user_dietary_restrictions'),
    ]

    operations = [
        migrations.CreateModel(
            name='DietaryRestriction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='dietary_restrictions',
        ),
        migrations.AddField(
            model_name='user',
            name='dietary_restrictions',
            field=models.ManyToManyField(blank=True, null=True, to='potluck.dietaryrestriction'),
        ),
    ]