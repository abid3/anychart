from typing import Union
from decimal import *
from dateutil import parser
from enum import Enum

import numpy

import constants as ct
from constants import Keys

PRECISION = Decimal(10) ** -2


class Symbol:

    def __init__(self, scrip: str, api_key: str, size: int):
        self.scrip = scrip
        self.api_key = api_key
        self.size = size


class DataObject:
    """
    A class for creating an object which contains candle data.
    """
    date, open, high, low, close, volume, turnover = None, None, None, None, None, None, None

    def __init__(self, item: numpy.record = None, **kwargs):
        """
        Converts data received from Quandl in DataObject
        :param item: numpy.record
                Data Type Received from Quandl API of each data point.
        :param kwargs: For Initializing a object using dict or key-value pairs or like optional parameters.
        """
        if item is not None:
            self.date = date_format([item[0]])[0]
            self.open = item[1]
            self.high = item[2]
            self.low = item[3]
            self.close = item[4]
            self.volume = item[5]
            self.turnover = item[6]
        else:
            self.date = kwargs[Keys.date]
            self.open = kwargs[Keys.open]
            self.high = kwargs[Keys.high]
            self.low = kwargs[Keys.low]
            self.close = kwargs[Keys.close]
            self.volume = kwargs[Keys.volume]
            self.turnover = kwargs[Keys.turnover]

    def __str__(self) -> str:
        return "Date: %s \nOpen: %s \nHigh: %s \nLow: %s \nClose: %s \nVolume: %s \nTurnOver: %s" % (
            self.date, self.open, self.high, self.low, self.close, self.volume, self.turnover)
