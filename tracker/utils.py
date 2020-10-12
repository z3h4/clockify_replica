# from django.utils import timezone
from django.utils.timezone import make_aware
from datetime import datetime
import pytz


def convert_to_datetime(datetime_obj, str_time):
    date = str(datetime_obj.date()) + ' ' + \
        str_time + ' ' + str(datetime_obj.second) + \
        '.' + str(datetime_obj.microsecond)

    # aware = make_aware(datetime.strptime(date, '%d-%m-%Y'))

    # return pytz.utc.localize(datetime.strptime(date, '%Y-%m-%d %I:%M%p %S.%f'))
    return make_aware(datetime.strptime(date, '%Y-%m-%d %I:%M%p %S.%f'))
