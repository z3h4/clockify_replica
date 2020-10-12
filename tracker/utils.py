from datetime import datetime


def convert_to_datetime(datetime_obj, str_time):
    date = str(datetime_obj.date()) + ' ' + \
        str_time + ' ' + str(datetime_obj.second) + \
        '.' + str(datetime_obj.microsecond)
    return datetime.strptime(date, '%Y-%m-%d %I:%M%p %S.%f')
