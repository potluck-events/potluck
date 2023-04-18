# HEROKU SERVER INFO
https://potluck.herokuapp.com/

# DJ-REST ENDPOINTS
https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html

# POTLUCK ENDPOINTS

events/hosting --> |GET|
-- lists all events hosted by current user with a date_scheduled >= today

events/attending --> |GET|
-- lists all events attended by current user with a date_scheduled >= today

items --> |GET|
-- lists all items owned by current user attached to an event with a date_scheduled >= today

events --> |POST|
-- user can create a new event. user is automatically set to be the host, and cannot create an event with a date_scheduled < today