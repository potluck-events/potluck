# django imports
from django.contrib import admin

# local app imports
from .models import (User,
                     DietaryRestriction,
                     Event,
                     Invitation,
                     Item,
                     Post,
                     Notification)

admin.site.register(User)
admin.site.register(DietaryRestriction)
admin.site.register(Event)
admin.site.register(Invitation)
admin.site.register(Item)
admin.site.register(Post)
admin.site.register(Notification)
