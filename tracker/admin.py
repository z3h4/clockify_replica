from django.contrib import admin
from .models import Project, Task, TimeEntry


class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ('task', 'start_time', 'end_time')


admin.site.register(Project)
admin.site.register(Task)
admin.site.register(TimeEntry, TimeEntryAdmin)
