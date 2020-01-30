from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.home,name='home'),
    path('signup',views.signup,name='signup'),
    path('home/',views.home1,name='home'),
    path('login',views.login,name='signup'),
    
    ]

