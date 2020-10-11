from django.urls import path
# from . import views
from .views import ProjectList

# app_name = 'tracker'

# urlpatterns = [
#     path('', views.index, name='index')
# ]

urlpatterns = [
    path('', ProjectList.as_view(), name='project_url')
]
