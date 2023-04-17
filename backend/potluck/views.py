from django.shortcuts import render
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

import urllib.parse

import requests


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def create(self, request, *args, **kwargs):
        # perform additional actions here
        response = super().create(request, *args, **kwargs)
        # perform additional actions here
        return response


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:8000/dj-rest-auth/google/code'
    client_class = OAuth2Client

# Make testing easier


@api_view(['GET'])
def CodeView(request):
    """
    List all code snippets, or create a new snippet.
    """

    if request.method == 'GET':
        code = urllib.parse.unquote(request.query_params['code'])

        url = request.build_absolute_uri('/dj-rest-auth/google/')
        response = requests.post(url, json={"code": code})
        return (response.json())
