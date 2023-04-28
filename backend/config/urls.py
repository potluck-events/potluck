"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from potluck import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('accounts/', include('dj_rest_auth.urls')),
    path('accounts/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/google/', views.GoogleLogin.as_view(),
         name='google_login'),  # google auth location
    path('accounts/google/code/', views.CodeView),
    path('accounts/registration/',
         views.CustomRegisterView.as_view(), name='custom_register'),  # custom registration URL
    path('accounts/registration/', include('dj_rest_auth.registration.urls')),

    path('users/me', views.UserProfile.as_view(), name='me'),
    path('users/info/<str:email>', views.GetUserInfo.as_view()),

    path('events', views.ListCreateEvent.as_view()),
    path('events/history', views.EventHistory.as_view()),
    path('events/<int:pk>', views.EventDetails.as_view()),

    path('events/<int:pk>/items', views.ListCreateItem.as_view()),
    path('events/<int:pk>/posts', views.ListCreatePost.as_view()),
    path('events/<int:pk>/invitations', views.ListCreateInvitations.as_view()),

    path('items', views.UserItems.as_view()),
    path('items/<int:pk>', views.ItemDetails.as_view()),
    path('items/<int:pk>/reserved', views.ReserveItem.as_view()),

    path('invitations', views.UserInvitations.as_view()),
    path('invitations/<int:pk>', views.InvitationDetails.as_view()),

    path('invite-code/<str:code>',
         views.CreateInvitationFromCode.as_view()),

    path('posts/<int:pk>', views.DeletePost.as_view()),
    path('dietary-restrictions', views.ListDietaryRestrictions.as_view()),
    path('notifications', views.UserNotifications.as_view()),
]
