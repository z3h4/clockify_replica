from django.shortcuts import render, redirect
from django.views.generic import View

from .models import Project, TimeEntry
from .forms import ProjectForm


# def index(request):
#     form = ProjectForm()
#     return render(request, 'tracker/index.html', {'form': form})

class ProjectList(View):
    def get(self, request):
        form = ProjectForm()
        projects = Project.objects.all()
        # time_entries = TimeEntry.objects.all()
        time_entries = TimeEntry.objects.select_related('task__project').all()

        return render(request, 'tracker/projects.html', context={'projects': projects, 'time_entries': time_entries, 'form': form})


# class TimeEntryList(View):
#     def get(self, request):
#         time_entries = TimeEntry.objects.all()
#         return render(request, 'tracker/time_entry_list.html', context={'time_entries': time_entries})
