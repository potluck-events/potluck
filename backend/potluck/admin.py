from django.contrib import admin
from .models import User, Event, Invitation, Item, Post

admin.site.register(User)
admin.site.register(Event)
admin.site.register(Invitation)
admin.site.register(Item)
admin.site.register(Post)
