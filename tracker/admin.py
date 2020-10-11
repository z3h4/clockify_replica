from django.contrib import admin
from .models import Project, Task, TimeEntry

# Register your models here.


# class ProjectAdmin(admin.ModelAdmin):
#     list_display = ('name',)


# class TaskAdmin(admin.ModelAdmin):
#     list_display = ('name',)

class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ('task', 'start_time', 'end_time', 'date')


admin.site.register(Project)
admin.site.register(Task)
admin.site.register(TimeEntry, TimeEntryAdmin)
