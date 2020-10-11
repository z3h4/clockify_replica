from django import forms

from .models import Project, Task


class ProjectForm(forms.ModelForm):

    class Meta:
        model = Project
        fields = '__all__'


class TaskForm(forms.ModelForm):
    name = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'What are you working on?'}))

    class Meta:
        model = Task
        fields = ['name']
