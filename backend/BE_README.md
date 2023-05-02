

## BASE URL
https://potluck.herokuapp.com/

https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html

## DJ-REST ENDPOINTS

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
