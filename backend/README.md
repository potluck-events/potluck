
# Bash (_Potluck_)
Bash is an app designed to make planning events simple and fun.

## BASE URL
https://potluck.herokuapp.com/


## Features
* Users can create an event, edit the details of an event, or cancel it altogether.
  * When creating an event, users can add a spotify playlist which guests can contribute to.
  * When creating an event, users can add a tip jar--a link to their Venmo account which guests can donate to.
* Hosts can invite guests and see RSVPs, as well as delete invitations.
* Users can view upcoming or past events, and can duplicate an event they previously hosted, including the guest list.
* Users can add a profile picture and list their dietary restrictions.
* Hosts can request items or favors which a guest can then accept or unaccept.
* Guests can show items they intend to bring to the event, whether the item was requested by the host or not.
* Users can see a shopping list of items they have agreed to bring to an event, and can check them off as they acquire them.
* Users can post and view comments on events they are attending.
* Users recieve notifications regarding events, invitations, rsvps, items and posts.


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

### Create Local PostgreSQL Database

9. Install PostgreSQL:

    `brew install postgresql`

10. Start PostgreSQL:

    `brew services start postgresql`

11. Create a user:

    `createuser -d <username>`

12. Create a database:

    `createdb -U <username> <dbname>`

13. Install a PostgreSQL adapter:

    `pipenv install psycopg2-binary`

### Environment Variables

14. Create a .env file in the backend folder:

    `touch ./potluck/backend/.env`


## ENDPOINTS

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

### Invitation Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /invitations/ | GET | view invitiations for upcoming events received by the user |
| /events/int:pk/invitations/ | GET, POST | view/create invitations for event with given pk |
| /invitations/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete invitation with given pk |

### Item Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /items/ | GET | show items owned by the user for upcoming events |
| /items/int:pk/ | GET, PUT, PATCH, DELETE | view/edit/delete item with given pk |
| /items/int:pk/reserved | PATCH | own/un-own item with given pk |
| /events/int:pk/items | GET, POST | show/create items for event with given pk |

### Post Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /events/int:pk/posts/ | GET, POST | show/create posts for event with given pk |
| /posts/int:pk/ | DELETE | delete post with given pk |

### Notification Endpoints
| URL | Methods | Description |
| :---: | :---: | :---: |
| /notifications/ | GET, DELETE | view/delete all notifications received by the user |
| /notifications/read/ | GET | show all notifications received by the user and mark them as is_read=True |
| /notifications/int:pk/ | DELETE | delete notification with given pk |


https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html
https://django-allauth.readthedocs.io/en/latest/views.html