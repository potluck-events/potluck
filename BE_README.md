# HEROKU SERVER INFO
https://potluck.herokuapp.com/

# DJ-REST ENDPOINTS
https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html

# POTLUCK ENDPOINTS

/users/me/ --> | GET | PUT | PATCH | DELETE |
-- details for logged in user

/users/info/:email/ --> | GET |
-- shows user info whose email is in the url

/events/ --> | GET | POST |
-- shows a list of all upcoming events that the user is hosting or attending
-- user can create a new event. user is automatically set to be the host, and cannot create an event with a date_scheduled < today

/events/history/ --> | GET |
-- list all past events that the user has attended OR hosted

/events/pk/ --> | GET | PUT | PATCH | DELETE |
-- shows event details. any user can make a GET request. only host can make PUT, PATCH, DELETE request.

/events/pk/items/ --> | POST |
-- shows items related to event pk
-- user can create an item for an event. if user is a guest, they will be automatically set as the owner. if user is host, owner field will be null.

/events/pk/posts/ --> | GET | POST |
-- lists posts related to event pk
-- user can create post related to event pk

/events/pk/invitations/ --> | GET | POST |
-- lists invitatinos related to event pk
-- host can create invitations

/items/ --> | GET |
-- lists all items owned by current user attached to an event with a date_scheduled >= today

/items/pk --> | GET | PUT | PATCH | DELETE |
-- host can edit/delete items
-- guests can only edit/delete items they created

/items/pk/reserved/ --> | PATCH |
-- guest can reserve/unreserve item

/invitations/ --> | GET |
-- lists all invitations received by current user with a date_scheduled >= today

/invitations/pk --> | GET | PUT | PATCH | DELETE |
-- host or guest can see invitation (get)
-- host can delete invitation
-- guest can accept/unaccept invitation

/posts/pk/ --> | DELETE |
-- user can delete post if user is author
-- host can delete any post related to event they are host of

/dietary-restrictions/ --> | GET |
-- lists all DietaryRestriction objects

/notifications/ --> | GET |
-- lists all notifications for the logged in user