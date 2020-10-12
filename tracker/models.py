from django.db import models

# Create your models here.


class Project(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Task(models.Model):
    name = models.CharField(max_length=255)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class TimeEntry(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
