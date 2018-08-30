from flask import Flask, render_template

result = {}
ohlc_data = {}
app = Flask(__name__)


def create_app(input_result,ohlc):
    """
    It creates a Flask App.
    :param input_result: result to be plotted
    :return: Flask App
    """
    app.config.from_pyfile('config.py', silent=True)
    app.debug = True
    app.templates_auto_reload = False
    global result,ohlc_data
    result = input_result
    ohlc_data = ohlc
    # app.add_url_rule(rule='/', endpoint="index", view_func=index("Hello"))
    return app

@app.route('/')
def _peichart():

    chart_title = ["Pie Chart: Basic Sample"]
    return render_template("pie_chart.html",main_title=chart_title,chartData=result)

@app.route('/areachart/')
def _areachart():

    chart_title = ["Area Chart"]
    return render_template("area_chart.html",main_title=chart_title,chartData=result)

@app.route('/barchart/')
def _barchart():

    chart_title = ["Bar Chart"]
    return render_template("bar_chart.html",main_title=chart_title,chartData=result)


@app.route('/linechart/')
def _linechart():

    chart_title = ["Line Chart"]
    return render_template("line_chart.html",main_title=chart_title,chartData=result)

@app.route('/columnchart/')
def _columnchart():

    chart_title = ["Column Chart"]
    return render_template("columnchart.html",main_title=chart_title,chartData=result)

@app.route('/ohlc/')
def _ohlcchart():

    chart_title = ["Ohlc Chart"]
    return render_template("ohlcchart.html",main_title=chart_title,chartData=ohlc_data)

@app.route('/candlestick/')
def _candlestickchart():

    chart_title = ["Candlestick Chart"]
    return render_template("candlechart.html",main_title=chart_title,chartData=ohlc_data)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
