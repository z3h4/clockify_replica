from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import HttpResponse
from django.http import JsonResponse
from django.forms.models import model_to_dict

from datetime import datetime
import json

from .models import Project, TimeEntry
from .forms import *
from .utils import *


class TimeTracker(View):
    def get(self, request):
        form = ProjectForm()
        task_form = TaskForm()
        projects = Project.objects.all()
        # time_entries = TimeEntry.objects.all()
        time_entries = TimeEntry.objects.select_related(
            'task__project').all().filter(end_time__isnull=False)

        for entry in time_entries:
            timeDelta = (entry.end_time - entry.start_time).seconds
            hours, remainder = divmod(timeDelta, 3600)
            minutes, seconds = divmod(remainder, 60)
            entry.time_spent = '{:02}:{:02}:{:02}'.format(
                int(hours), int(minutes), int(seconds))
            entry.date = entry.end_time.date
            # entry.time_spent = entry.end_time - entry.start_time

        return render(request, 'tracker/projects.html', context={'projects': projects, 'time_entries': time_entries, 'form': form, 'task_form': task_form})


class ProjectList(View):
    def get(self, request):
        projects = Project.objects.order_by('-id').values()
        return JsonResponse({'projects': list(projects)}, status=200)

# TODO: The name should create a new entry if not present in the database


class TaskUpdate(View):
    def post(self, request, id):
        data = json.loads(request.body)
        task = Task.objects.get(id=id)
        task.name = data['name']
        task.save()

        return JsonResponse({'task': model_to_dict(task)}, status=200)


class TaskList(View):
    def get(self, request):
        tasks = Task.objects.values()
        return JsonResponse({'tasks': list(tasks)}, status=200)


class TimeEntryCreate(View):
    def post(self, request):
        # form = ProjectForm(request.POST)
        data = json.loads(request.body)
        # TODO: trim the input
        try:
            task = Task.objects.get(name=data['name'])
            time_entry = TimeEntry.objects.create(
                task_id=task.id, start_time=datetime.now())
            return JsonResponse({'time_entry': model_to_dict(time_entry)}, status=200)
            # return JsonResponse({'result': 'ok'}, status=200)
        except Task.DoesNotExist:
            # TODO: Create new task
            print("Xxxxxxxxxxxxafhgjhaksjasxxa")


class TimeEntryUpdate(View):
    def post(self, request, id):
        data = json.loads(request.body)
        try:
            time_entry = TimeEntry.objects.get(id=id)
        except TimeEntry.DoesNotExist:
            return JsonResponse({'result': 'ok'}, status=404)

        if 'start_time' in data:
            datetime_object = convert_to_datetime(
                time_entry.start_time, data['start_time'])

            time_entry.start_time = datetime_object
            time_entry.save()

            return JsonResponse({'time_entry': model_to_dict(time_entry)}, status=200)
        elif 'end_time' in data:
            datetime_object = convert_to_datetime(
                time_entry.end_time, data['end_time'])

            time_entry.end_time = datetime_object
            time_entry.save()

            return JsonResponse({'time_entry': model_to_dict(time_entry)}, status=200)

# class TimeEntryList(View):
#     def get(self, request):
#         time_entries = TimeEntry.objects.all()
#         return render(request, 'tracker/time_entry_list.html', context={'time_entries': time_entries})
