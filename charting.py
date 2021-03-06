from flask import Flask, render_template

import api
import data_parser
import indicators
import strategy
from strategy import Strategies
from model import *

app = Flask(__name__)

"""
List of Chart:
1. Chart with indicators
2. BackTest with Annotation (Buy and Sell)
3. BackTest Report - Cum P&L all
                   - Cum P&L Long
                   - Cum P&L Short
"""


@app.route('/')
def chart():
    """
    For plotting normal candle chart or along with indicators
    :return: None
    """
    # prop, data = data_parser.get_data(start_date="2017-08-18")
    # result = Strategies.rsi(data, data_properties=prop)
    # data_properties = result['data_properties']
    # main_chart = []
    # for key, values in data_properties.items():
    #     main_chart.append([key, values])
    # params = result['params']
    # data = result['data']

    # print(params,data_with_indicators)
    # final_data = data_with_indicators[1:]
    # print(final_data)

    data_prop, data = data_parser.get_data(start_date="2007-01-18")
    high = data_parser.get_high(data)
    low = data_parser.get_low(data)
    close = data_parser.get_close(data)
    sma = indicators.sma(close)
    ema = indicators.ema(close)
    macd = indicators.macd(close)
    rsi = indicators.rsi(close)
    stoch = indicators.stoch(high, low, close)
    bbands = indicators.bollinger_bands(close)
    pivot = indicators.pivot(data)
    chart_1 = ChartElement(data=sma, label="sma", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.YELLOW)
    chart_2 = ChartElement(data=ema, label="ema", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.PINK)
    chart_3 = ChartElement(data=stoch, label="stoch", chart_type=ChartType.LINE, plot=ChartAxis.DIFFERENT_AXIS,
                           color=ChartColor.PURPLE)
    chart_4 = ChartElement(data=bbands, label="bbands", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.BLUE)
    chart_5 = ChartElement(data=pivot, label="pivot", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.GREEN)
    chart_6 = ChartElement(data=rsi, label="rsi", chart_type=ChartType.LINE, plot=1,
                           color=ChartColor.RED)
    chart_7 = ChartElement(data=macd, label="macd", chart_type=ChartType.LINE, plot=2,
                           color="magenta")
    charts = [chart_4, chart_6]
    buy = Condition(data1=sma, data2=ema, operation=Operation.CROSSOVER)
    sell = Condition(data1=rsi, data2=70, operation=Operation.GREATER_THAN)
    result = strategy.strategy_builder(data_properties=data_prop, data_list=data, charts=charts, buy=buy, sell=sell,
                                       target=1.0, sl=0.5, strategy=strategy.BUY)
    # strategy.show_back_testing_reports(result, auto_open=True)
    data_properties = result['data_properties']
    main_chart = []
    for key, values in data_properties.items():
        main_chart.append([key, values])
    params = result['params']
    # print(params)
    data_list = result['data']
    return render_template("chart.html", chartData=data_list, chart_params=params,
                           main_chart_properties=main_chart)


@app.route('/backtest/')
def back_testing():
    """
    For plotting back test chart with annotations.
    :return: None
    """
    data_prop, data = data_parser.get_data(start_date="2007-01-18")
    high = data_parser.get_high(data)
    low = data_parser.get_low(data)
    close = data_parser.get_close(data)
    sma = indicators.sma(close)
    ema = indicators.ema(close)
    macd = indicators.macd(close)
    rsi = indicators.rsi(close)
    stoch = indicators.stoch(high, low, close)
    bbands = indicators.bollinger_bands(close)
    pivot = indicators.pivot(data)
    chart_1 = ChartElement(data=sma, label="sma", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.YELLOW)
    chart_2 = ChartElement(data=ema, label="ema", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.PINK)
    chart_3 = ChartElement(data=stoch, label="stoch", chart_type=ChartType.LINE, plot=ChartAxis.DIFFERENT_AXIS,
                           color=ChartColor.PURPLE)
    chart_4 = ChartElement(data=bbands, label="bbands", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.BLUE)
    chart_5 = ChartElement(data=pivot, label="pivot", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.GREEN)
    chart_6 = ChartElement(data=rsi, label="rsi", chart_type=ChartType.LINE, plot=1,
                           color=ChartColor.RED)
    chart_7 = ChartElement(data=macd, label="macd", chart_type=ChartType.LINE, plot=2,
                           color="magenta")
    charts = [chart_4, chart_6]
    buy = Condition(data1=sma, data2=ema, operation=Operation.CROSSOVER)
    sell = Condition(data1=rsi, data2=70, operation=Operation.GREATER_THAN)
    result = strategy.strategy_builder(data_properties=data_prop, data_list=data, charts=charts, buy=buy, sell=sell,
                                       target=1.0, sl=0.5, strategy=strategy.BUY)
    # strategy.show_back_testing_reports(result)
    data_properties = result['data_properties']
    main_chart = []
    for key, values in data_properties.items():
        main_chart.append([key, values])
    params = result['params']
    # print(params)
    data_list = result['data']
    annotations = result['annotations']
    return render_template("backtest.html", chartData=data_list, chart_params=params,
                           main_chart_properties=main_chart, chart_annotations=annotations)


@app.route('/bt_report_all/')
def cum_pl_all():
    """
    Chart for back test reports of Cumulative profit and loss
    :return: None
    """
    data_prop, data = data_parser.get_data(start_date="2007-01-18")
    high = data_parser.get_high(data)
    low = data_parser.get_low(data)
    close = data_parser.get_close(data)
    sma = indicators.sma(close)
    ema = indicators.ema(close)
    macd = indicators.macd(close)
    rsi = indicators.rsi(close)
    stoch = indicators.stoch(high, low, close)
    bbands = indicators.bollinger_bands(close)
    pivot = indicators.pivot(data)
    chart_1 = ChartElement(data=sma, label="sma", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.YELLOW)
    chart_2 = ChartElement(data=ema, label="ema", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.PINK)
    chart_3 = ChartElement(data=stoch, label="stoch", chart_type=ChartType.LINE, plot=ChartAxis.DIFFERENT_AXIS,
                           color=ChartColor.PURPLE)
    chart_4 = ChartElement(data=bbands, label="bbands", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.BLUE)
    chart_5 = ChartElement(data=pivot, label="pivot", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.GREEN)
    chart_6 = ChartElement(data=rsi, label="rsi", chart_type=ChartType.LINE, plot=1,
                           color=ChartColor.RED)
    chart_7 = ChartElement(data=macd, label="macd", chart_type=ChartType.LINE, plot=2,
                           color="magenta")
    charts = [chart_1, chart_2, chart_3, chart_6]
    buy = Condition(data1=sma, data2=ema, operation=Operation.CROSSOVER)
    sell = Condition(data1=rsi, data2=70, operation=Operation.GREATER_THAN)
    result = strategy.strategy_builder(data_properties=data_prop, data_list=data, charts=charts, buy=buy, sell=sell,
                                       target=1.0, sl=0.5, strategy=strategy.BUY)

    cum_all = result['all']['DATE_CUM_PL']
    # print(cum_all)
    return render_template("cum_pl_all.html", chartData=cum_all)


@app.route('/bt_report_long/')
def cum_pl_long():
    """
    Chart for back test reports of Cumulative profit and loss
    :return: None
    """
    data_prop, data = data_parser.get_data(start_date="2007-01-18")
    high = data_parser.get_high(data)
    low = data_parser.get_low(data)
    close = data_parser.get_close(data)
    sma = indicators.sma(close)
    ema = indicators.ema(close)
    macd = indicators.macd(close)
    rsi = indicators.rsi(close)
    stoch = indicators.stoch(high, low, close)
    bbands = indicators.bollinger_bands(close)
    pivot = indicators.pivot(data)
    chart_1 = ChartElement(data=sma, label="sma", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.YELLOW)
    chart_2 = ChartElement(data=ema, label="ema", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.PINK)
    chart_3 = ChartElement(data=stoch, label="stoch", chart_type=ChartType.LINE, plot=ChartAxis.DIFFERENT_AXIS,
                           color=ChartColor.PURPLE)
    chart_4 = ChartElement(data=bbands, label="bbands", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.BLUE)
    chart_5 = ChartElement(data=pivot, label="pivot", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.GREEN)
    chart_6 = ChartElement(data=rsi, label="rsi", chart_type=ChartType.LINE, plot=1,
                           color=ChartColor.RED)
    chart_7 = ChartElement(data=macd, label="macd", chart_type=ChartType.LINE, plot=2,
                           color="magenta")
    charts = [chart_1, chart_2, chart_3, chart_6]
    buy = Condition(data1=sma, data2=ema, operation=Operation.CROSSOVER)
    sell = Condition(data1=rsi, data2=70, operation=Operation.GREATER_THAN)
    result = strategy.strategy_builder(data_properties=data_prop, data_list=data, charts=charts, buy=buy, sell=sell,
                                       target=1.0, sl=0.5, strategy=strategy.BUY)

    cum_long = result['long']['DATE_CUM_PL']
    # print(cum_long)
    return render_template("cum_pl_long.html", longData=cum_long)


@app.route('/bt_report_short/')
def cum_pl_short():
    """
    Chart for back test reports of Cumulative profit and loss
    :return: None
    """
    data_prop, data = data_parser.get_data(start_date="2000-01-18")
    high = data_parser.get_high(data)
    low = data_parser.get_low(data)
    close = data_parser.get_close(data)
    sma = indicators.sma(close)
    ema = indicators.ema(close)
    macd = indicators.macd(close)
    rsi = indicators.rsi(close)
    stoch = indicators.stoch(high, low, close)
    bbands = indicators.bollinger_bands(close)
    pivot = indicators.pivot(data)
    chart_1 = ChartElement(data=sma, label="sma", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.YELLOW)
    chart_2 = ChartElement(data=ema, label="ema", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.PINK)
    chart_3 = ChartElement(data=stoch, label="stoch", chart_type=ChartType.LINE, plot=ChartAxis.DIFFERENT_AXIS,
                           color=ChartColor.PURPLE)
    chart_4 = ChartElement(data=bbands, label="bbands", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.BLUE)
    chart_5 = ChartElement(data=pivot, label="pivot", chart_type=ChartType.LINE, plot=ChartAxis.SAME_AXIS,
                           color=ChartColor.GREEN)
    chart_6 = ChartElement(data=rsi, label="rsi", chart_type=ChartType.LINE, plot=1,
                           color=ChartColor.RED)
    chart_7 = ChartElement(data=macd, label="macd", chart_type=ChartType.LINE, plot=2,
                           color="magenta")
    charts = [chart_1, chart_2, chart_3, chart_6]
    buy = Condition(data1=sma, data2=ema, operation=Operation.CROSSOVER)
    sell = Condition(data1=rsi, data2=70, operation=Operation.GREATER_THAN)
    result = strategy.strategy_builder(data_properties=data_prop, data_list=data, charts=charts, buy=buy, sell=sell,
                                       target=1.0, sl=0.5, strategy=strategy.BUY)

    cum_short = result['short']['DATE_CUM_PL']
    # print(cum_short)

    return render_template("cum_pl_short.html", shortData=cum_short)


if __name__ == "__main__":
    app.run()
