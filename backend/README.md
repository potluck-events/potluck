
# Bash (_Potluck_)
Bash is an app designed to make planning events simple and fun.

#### BASE URL
https://potluck.herokuapp.com/

<br>

## Features
* Users can create an event, edit the details of an event, or cancel it altogether.
  * When creating an event, users can add a spotify playlist which guests can contribute to.
  * When creating an event, users can add a tip jar--a link to their Venmo account which guests can donate to.
* Hosts can invite guests and see RSVPs, as well as delete invitations.
  * Guests get notifications when they recieve an invitation, and Hosts get notifications when someone RSVPs to their event.
  * Guests also get notifications if their invitation is deleted.
* Users can view upcoming or past events, and can duplicate an event they previously hosted, including the guest list.
  * Users have the option to edit the event after duplicating, and can modify their guest list before sending invitations.
* Users can add a profile picture and list their dietary restrictions.
  * Dietary restrictions are displayed on event details, but will not show exactly who it belongs to. For example, if one vegetarian is attending an event, "1 Vegetarian" will be displayed. This is meant to help plan around guests needs in an anonymous manner.
* Hosts can request items or favors which a guest can then accept or unaccept.
  * Guests get notifications when a host creates an item, encouraging them to help by bringing it to the event.
  * Hosts get notifications when a guest agrees to bring an item, and gets notified if a guest changes their mind and can no longer bring an item. If this happens, guests are also re-notified that the host needs someone to bring the item.
* Guests can show items they intend to bring to the event, whether the item was requested by the host or not.
* Users can see a shopping list of items they have agreed to bring to an event, and can check them off as they acquire them.
* Users can view and create posts, or comments, on events they are attending.
  * Hosts can delete any or all posts.
  * Guests can delete their own posts.
  * Users get notifications when someone makes a post on an event they are hosting or attending.

<br>

## Run Locally

### Getting Started

1. Clone the project:

    `git clone https://github.com/potluck-events/potluck.git`

2. Navigate to the project directory:

    `cd potluck`

3. Navigate to the backend folder:

    `cd backend`

4. Set up a virtual environment for the project using pipenv. If you don't have pipenv installed, you can install it using pip:

    `pip install pipenv`

5. Then, activate the virtual environment by running:

    `pipenv shell`

6. Install the project dependencies:

    `pipenv install`

7. Set up the database by running the migrations:

    `python manage.py migrate`

8. Start the development server:

    `python manage.py runserver`

The app should now be running at http://localhost:8000/

9. You can create a django superuser by running:

    `python manage.py createsuperuser`

And you can log into the django admin at http://localhost:8000/admin/ to manage local data.

<br>

### Create Local PostgreSQL Database

10. Install PostgreSQL:

    `brew install postgresql`

11. Start PostgreSQL:

    `brew services start postgresql`

12. Create a user:

    `createuser -d <username>`

13. Create a database:

    `createdb -U <username> <dbname>`

14. Install a PostgreSQL adapter:

    `pipenv install psycopg2-binary`

<br>

### Environment Variables

15. Create a .env file in the backend folder:

    `touch ./potluck/backend/.env`

16. Open the .env file in a text editor and set your environment variables in the following format: 'VARIABLE_NAME=value'

For example:

    SECRET_KEY=my_secret_key
    DEBUG=True
    DJANGO_SUPERUSER_USERNAME=admin
    DJANGO_SUPERUSER_PASSWORD=admin_password
    DJANGO_SUPERUSER_EMAIL=admin@example.com

* DATABASE_URL: This should be set to the URL of your database. Depending on your database type, this may include a username, password, host, and port.

* SECRET_KEY: This should be set to a secret key that is used for cryptographic signing in Django. It is important that this value is kept secret and is not shared publicly.

* DEBUG: This should be set to a boolean value (True or False) and is used to enable or disable debugging in Django. It is recommended to set this to False in production environments.

* DJANGO_SUPERUSER_USERNAME: This should be set to the username you want to use for the Django superuser account.

* DJANGO_SUPERUSER_PASSWORD: This should be set to the password you want to use for the Django superuser account.

* DJANGO_SUPERUSER_EMAIL: This should be set to the email address you want to use for the Django superuser account.

17. Save the .env file.

<br>

## ENDPOINTS

All endpoints have `permission_classes = [IsAuthenticated]`

Some endpoints have additional custom permissions.

### User Profile Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /users/me/ | GET, PUT, PATCH, DELETE | view/edit/delete user profile |
| /users/info/str:email | GET | view profile of user with given email |

<br>

### Dietary Restriction Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /dietary-restrictions/ | GET | view all DietaryRestriction objects |

<br>

### Event Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /events/ | GET, POST | view upcoming events the user is hosting or attending; create new event |
| /events/history/ | GET | view past events the user has hosted or attended |
| /events/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete event with given pk |

#### Custom Permissions
**/events/int:pk/**

* `GET:` user must be the host or a guest of event
* `PUT, PATCH, DELETE:` user must be the host of event

<br>

### Invitation Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /invitations/ | GET | view invitiations for upcoming events received by the user |
| /events/int:pk/invitations/ | GET, POST | view/create invitations for event with given pk |
| /invitations/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete invitation with given pk |

#### Custom Permissions
**/events/int:pk/invitations/**
* `POST:` user must be the host of event

**/invitations/int:pk/**
* `GET:` user must be the host of the related event or the recipient of the invitation
* `DELETE:` user must be the host of the related event
* `PUT, PATCH:` user must be the recipient of the invitation

<br>

### Item Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /items/ | GET | show items owned by the user for upcoming events |
| /items/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete item with given pk |
| /items/int:pk/reserved | PATCH | own/un-own item with given pk |
| /events/int:pk/items | GET, POST | show/create items for event with given pk |

<br>

### Post Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /events/int:pk/posts/ | GET, POST | show/create posts for event with given pk |
| /posts/int:pk/ | DELETE | delete post with given pk |

<br>

### Notification Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /notifications/ | GET, DELETE | view/delete all notifications received by the user |
| /notifications/read/ | GET | show all notifications received by the user and mark them as is_read=True |
| /notifications/int:pk/ | DELETE | delete notification with given pk |

<br>

https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html