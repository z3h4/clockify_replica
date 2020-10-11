from django.urls import path
# from . import views
from .views import *

# app_name = 'tracker'

# urlpatterns = [
#     path('', views.index, name='index')
# ]

urlpatterns = [
    path('', ProjectList.as_view(), name='project_url'),
    path('<str:id>/task_updated', TaskUpdate.as_view(), name='task_update_url'),
    path('time_entry_created',
         TimeEntryCreate.as_view(), name='time_entry_create_url'),
    path('task_list', TaskList.as_view(), name='task_list_url')

]
