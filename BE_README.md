# HEROKU SERVER INFO
https://potluck.herokuapp.com/

# DJ-REST ENDPOINTS
https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html

# POTLUCK ENDPOINTS

/users/me/ --> | GET | PUT | PATCH | DELETE |
-- details for logged in user

/events/hosting/ --> | GET |
-- lists all events hosted by current user with a date_scheduled >= today

/events/attending/ --> | GET |
-- lists all events attended by current user with a date_scheduled >= today

/items/ --> | GET |
-- lists all items owned by current user attached to an event with a date_scheduled >= today

/items/pk --> | GET | PUT | PATCH | DELETE |
-- host can edit/delete items
-- guests can only edit/delete items they created

/items/pk/reserved/ --> | PATCH |
-- guest can reserve/unreserve item

/events/ --> | POST |
-- user can create a new event. user is automatically set to be the host, and cannot create an event with a date_scheduled < today

/events/pk/ --> | GET | PUT | PATCH | DELETE |
-- shows event details. any user can make a GET request. only host can make PUT, PATCH, DELETE request.

/events/pk/items/ --> | POST |
-- user can create an item for an event. if user is a guest, they will be automatically set as the owner. if user is host, owner field will be null.

/events/pk/posts/ --> | GET | POST |
-- lists posts related to event pk
-- user can create post related to event pk

/invitations/ --> | GET |
-- lists all invitations received by current user with a date_scheduled >= today

/posts/pk/ --> | DELETE |
-- user can delete post if user is author
-- host can delete any post related to event they are host of