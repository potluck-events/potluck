from django.contrib import admin
from .models import User, DietaryRestriction, Event, Invitation, Item, Post

admin.site.register(User)
admin.site.register(DietaryRestriction)
admin.site.register(Event)
admin.site.register(Invitation)
admin.site.register(Item)
admin.site.register(Post)
