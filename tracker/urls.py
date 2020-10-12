from django.urls import path
from .views import *


urlpatterns = [
    path('', TimeTracker.as_view(), name='project_url'),
    path('<str:id>/task_updated', TaskUpdate.as_view(), name='task_update_url'),
    path('time_entry_created',
         TimeEntryCreate.as_view(), name='time_entry_create_url'),
    path('<str:id>/time_entry_deleted',
         TimeEntryDelete.as_view(), name='time_entry_delete_url'),
    path('task_list', TaskList.as_view(), name='task_list_url'),
    path('project_list', ProjectList.as_view(), name='project_list_url'),
    path('time_entry/<str:id>/update',
         TimeEntryUpdate.as_view(), name='project_list_url')

]
