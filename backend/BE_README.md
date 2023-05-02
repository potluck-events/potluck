## BASE URL
https://potluck.herokuapp.com/

## DJ-REST ENDPOINTS
https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html

## POTLUCK ENDPOINTS

* /users/me/ --> | GET | PUT | PATCH | DELETE |
-- details for logged in user

* /users/info/:email/ --> | GET |
-- shows user info whose email is in the url

* /events/ --> | GET | POST |
-- shows a list of all upcoming events that the user is hosting or attending
-- user can create a new event. user is automatically set to be the host, and cannot create an event with a date_scheduled < today

* /events/history/ --> | GET |
-- list all past events that the user has attended OR hosted

* /events/pk/ --> | GET | PUT | PATCH | DELETE |
-- shows event details. any user can make a GET request. only host can make PUT, PATCH, DELETE request.

* /events/pk/items/ --> | GET | POST |
-- shows items related to event pk
-- user can create an item for an event. if user is a guest, they will be automatically set as the owner. if user is host, owner field will be null.

* /events/pk/posts/ --> | GET | POST |
-- lists posts related to event pk
-- user can create post related to event pk

* /events/pk/invitations/ --> | GET | POST |
-- lists invitatinos related to event pk
-- host can create invitations

* /items/ --> | GET |
-- lists all items owned by current user attached to an event with a date_scheduled >= today

* /items/pk --> | GET | PUT | PATCH | DELETE |
-- host can edit/delete items
-- guests can only edit/delete items they created

* /items/pk/reserved/ --> | PATCH |
-- guest can reserve/unreserve item

* /invitations/ --> | GET |
-- lists all invitations received by current user with a date_scheduled >= today

* /invitations/pk --> | GET | PUT | PATCH | DELETE |
-- host or guest can see invitation (get)
-- host can delete invitation
-- guest can accept/unaccept invitation

* /posts/pk/ --> | DELETE |
-- user can delete post if user is author
-- host can delete any post related to event they are host of

* /dietary-restrictions/ --> | GET |
-- lists all DietaryRestriction objects

* /notifications/ --> | GET | DELETE |
-- lists all notifications for the logged in user

* /notifications/read/ --> | GET |
-- lists all notifications for the logged in user, and marks them all is_read=True

* /notifications/pk --> | GET | PUT | PATCH | DELETE |
-- user can delete notification or mark 'is_read' if they are the recipient


## POTLUCK ENDPOINTS

### User Profile Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /users/me/ | GET, PUT, PATCH, DELETE | view/edit/delete user profile |
| /users/info/str:email | GET | view profile of user with given email |

### Dietary Restriction Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /dietary-restrictions/ | GET | view all DietaryRestriction objects |

### Event Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /events/ | GET, POST | view upcoming events the user is hosting or attending; create new event |
| /events/history/ | GET | view past events the user has hosted or attended |
| /events/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete event with given pk |

### Invitation Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /invitations/ | GET | view invitiations for upcoming events received by the user |
| /events/int:pk/invitations/ | GET, POST | view/create invitations for event with given pk |
| /invitations/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete invitation with given pk |

### Item Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /items/ | GET | show items owned by the user for upcoming events |
| /items/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete item with given pk |
| /items/int:pk/reserved | PATCH | own/un-own item with given pk |
| /events/int:pk/items | GET, POST | show/create items for event with given pk |

### Post Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /events/int:pk/posts/ | GET, POST | show/create posts for event with given pk |
| /posts/int:pk/ | DELETE | delete post with given pk |

### Notification Endpoints
| URL | Methods | Description |
| --- | --- | --- |
| /notifications/ | GET, DELETE | view/delete all notifications received by the user |
| /notifications/read/ | GET | show all notifications received by the user and mark them as is_read=True |
| /notifications/int:pk/ | GET, PUT, PATCH, DELETE | delete notification with given pk |
