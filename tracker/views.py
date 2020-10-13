from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import HttpResponse
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.db.models import Sum

from datetime import datetime, timedelta
from django.utils import timezone
import json

from .models import Project, TimeEntry
from .forms import *
from .utils import *


class TimeTracker(View):
    def get(self, request):
        form = ProjectForm()
        task_form = TaskForm()
        projects = Project.objects.all()
        time_entries = TimeEntry.objects.select_related(
            'task__project').all().filter(end_time__isnull=False)

        for entry in time_entries:
            entry.time_spent = calculate_time_spent(entry.task_time)
            entry.date = entry.end_time.date()

        return render(request, 'tracker/projects.html', context={'projects': projects, 'time_entries': time_entries, 'form': form, 'task_form': task_form})


class ProjectList(View):
    def get(self, request):
        projects = Project.objects.order_by('-id').values()
        return JsonResponse({'projects': list(projects)}, status=200)


class TaskUpdate(View):
    def post(self, request, id):
        data = json.loads(request.body)

        try:
            if 'project_id' in data:
                task = Task.objects.get(id=id)
                task.project_id = data['project_id']
                task.save()
            if 'name' in data:
                exists = Task.objects.filter(
                    project_id=data['project_id'], name=data['name']).exists()
                if exists:
                    task = Task.objects.get(name=data['name'])
                    task.name = data['name']
                    task.save()
                else:
                    task = Task.objects.create(
                        name=data['name'], project_id=data['project_id'])
                    time_entry = TimeEntry.objects.get(
                        id=data['time_entry_id'])
                    time_entry.task_id = task.id
                    time_entry.save()
        except Task.DoesNotExist:
            return JsonResponse({'result': 'ok'}, status=404)

        return JsonResponse({'task': model_to_dict(task)}, status=200)


class TaskList(View):
    def get(self, request):
        tasks = Task.objects.values()
        return JsonResponse({'tasks': list(tasks)}, status=200)


class TimeEntryCreate(View):
    def post(self, request):
        data = json.loads(request.body)

        if data['task_id'] is None:
            task = Task.objects.create(
                name=data['name'], project_id=data['project_id'])
            time_entry = TimeEntry.objects.create(
                task_id=task.id, start_time=timezone.now())
        else:
            time_entry = TimeEntry.objects.create(
                task_id=data['task_id'], start_time=timezone.now())

        return JsonResponse({'time_entry': model_to_dict(time_entry)}, status=200)


class TimeEntryUpdate(View):
    def post(self, request, id):
        data = json.loads(request.body)
        try:
            time_entry = TimeEntry.objects.select_related(
                'task__project').get(id=id)
        except TimeEntry.DoesNotExist:
            return JsonResponse({'result': 'ok'}, status=404)

        if 'start_time' in data:
            datetime_object = convert_to_datetime(
                time_entry.start_time, data['start_time'])

            time_entry.start_time = datetime_object
            time_entry.task_time = (
                time_entry.end_time - time_entry.start_time).total_seconds()
            time_entry.save()

            time_spent = calculate_time_spent(time_entry.task_time)

            return JsonResponse({'time_entry': model_to_dict(time_entry), 'time_spent': time_spent}, status=200)
        elif 'end_time' in data:
            if time_entry.end_time is None:
                time_entry.end_time = timezone.now()
                time_entry.task_time = (
                    time_entry.end_time - time_entry.start_time).total_seconds()
                time_entry.save()

                new_entries = {
                    'task_name': time_entry.task.name,
                    'project_id': time_entry.task.project.id,
                    'project_name': time_entry.task.project.name,
                    'start_time': timezone.localtime(time_entry.start_time).strftime('%I:%M%p'),
                    'end_time': timezone.localtime(time_entry.end_time).strftime('%I:%M%p'),
                    'time_spent': calculate_time_spent(time_entry.task_time),
                    'date': time_entry.end_time.strftime('%b %d, %Y')
                }

                return JsonResponse({'time_entry': model_to_dict(time_entry), 'new_entries': new_entries}, status=200)
            else:
                datetime_object = convert_to_datetime(
                    time_entry.end_time, data['end_time'])
                time_entry.end_time = datetime_object
                time_entry.task_time = (
                    time_entry.end_time - time_entry.start_time).total_seconds()
                time_entry.save()

                time_spent = calculate_time_spent(time_entry.task_time)

                return JsonResponse({'time_entry': model_to_dict(time_entry), 'time_spent': time_spent}, status=200)


class TimeEntryDelete(View):
    def post(self, request, id):
        try:
            time_entry = TimeEntry.objects.get(id=id)
        except TimeEntry.DoesNotExist:
            return JsonResponse({'result': 'ok'}, status=404)

        time_entry.delete()
        return JsonResponse({'result': 'ok'}, status=200)


class Dashboard(View):
    def get(self, request):
        date_hours_list = []

        for i in reversed(range(7)):
            task_date = timezone.now() - timedelta(days=i)
            total_task_time_in_seconds = TimeEntry.objects.filter(
                start_time__range=[task_date.date(), (task_date + timedelta(days=1)).date()]).aggregate(Sum('task_time'))

            if total_task_time_in_seconds['task_time__sum'] is not None:
                new_dict = {'date': datetime.strftime(task_date.date(), '%Y-%m-%d'), 'hours':
                            '{0:.2f}'.format(total_task_time_in_seconds['task_time__sum'] / (60 * 60))}

            else:
                new_dict = {'date': datetime.strftime(
                    task_date.date(), '%Y-%m-%d'), 'hours': 0}

            date_hours_list.append(dict(new_dict))

        return JsonResponse({'result': date_hours_list}, status=200)
