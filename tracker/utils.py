# from django.utils import timezone
from django.utils.timezone import make_aware
from datetime import datetime


def convert_to_datetime(datetime_obj, str_time):
    date = str(datetime_obj.date()) + ' ' + \
        str_time + ' ' + str(datetime_obj.second) + \
        '.' + str(datetime_obj.microsecond)

    return make_aware(datetime.strptime(date, '%Y-%m-%d %I:%M%p %S.%f'))


def calculate_time_spent(time_delta):
    hours, remainder = divmod(time_delta, 3600)
    minutes, seconds = divmod(remainder, 60)
    return '{:02}:{:02}:{:02}'.format(
        int(hours), int(minutes), int(seconds))
