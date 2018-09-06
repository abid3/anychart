var sdate;
var edate;
var clickCounter = 0;
function common() {
    return true;
}

common.prototype.SMA = function (data, period) {
    this._data = [];

    this.calculate = function () {
        if (data != null) {
            var total = 0;
            var j = 0;
            var count = data.length;

            for (j = 0; j < period; j++)
                this._data[j] = null;

            for (var i = period - 1; i < count; i++) {
                for (j = 0; j < period; j++) {
                    total += data[i - j];
                }

                this._data[i] = total / period;
                total = 0;
            }
        }
    };

    this.calculate();
    return this._data;
}

common.prototype.ATR = function (data, period) {
    this._sourceData = data;
    this._data = [];

    this.calculate = function () {
        if (this._sourceData != null) {
            var total = 0;
            var j = 0;
            var count = this._sourceData.length;
            this._TR = [];

            for (j = 0; j < period; j++) {
                this._data[j] = null;
            }
            for (var i = 0; i < count; i++) {
                var cH_cL = Math.abs(this._sourceData[i]["high"] - this._sourceData[i]["low"]);
                if (i == 0)
                    this._TR[this._TR.length] = cH_cL;
                else {
                    var cH_pC = Math.abs(this._sourceData[i]["high"] - this._sourceData[i - 1]["close"]);
                    var cL_pC = Math.abs(this._sourceData[i - 1]["low"] - this._sourceData[i - 1]["close"]);

                    this._TR[this._TR.length] = Math.max(cH_cL, cH_pC, cL_pC);
                }
            }

            this._data = this["EMA"](this._TR, period);
        }
    };

    this.calculate();
    return this._data;
}

common.prototype.EMA = function (data, period) {
    var returnArray = [];

    this.calculate = function () {
        if (data != null) {
            var total = 0;
            var j = 0;

            var multiplier = (2 / (period + 1));
            var count = data.length;

            for (j = 0; j < count; j++) {
                returnArray[j] = null;
            }

            for (var i = period - 1; i < count; i++) {
                if (returnArray[i - 1] == null) {
                    // First EMA value is actually a calculated SMA:
                    for (j = 0; j < period; j++) {
                        total += data[i - j];
                    }
                    returnArray[i] = total / period;
                }
                else {
                    returnArray[i] = ((data[i] - returnArray[i - 1]) * multiplier) + returnArray[i - 1];
                }
            }
        }
    };

    this.calculate();
    return returnArray;
}

var historyChart;

var LastMin = 0;

function addIntoHistory(GatewayId, Exchange, Token, LTP, volume) {
    var rowId = GatewayId.toUpperCase() + "_" + Exchange.toUpperCase() + "_" + Token.toUpperCase();
    var scriptlivedata = liveChartData[rowId];
    if (scriptlivedata == null) {
        return;
    }

    /*var dataTable = anychart.data.table();
    dataTable.addData(scriptlivedata);*/

    var currTime = new Date().format("HH:MM:ss").split(':');
    var currDate = new Date().format("yyyy/mm/dd").split('/');
    var DateTime = new Date();
    var year = DateTime.getFullYear();
    var month = DateTime.getMonth();
    var date = DateTime.getDate();
    var hours = DateTime.getHours();
    var Min = DateTime.getMinutes();
    //var second = DateTime.getSeconds();

    if (scriptlivedata.CandleInterval <= 480) {
        var modulovalue = scriptlivedata.CandleInterval;
        var hourmin;
        var strTime;
        /*if (modulovalue >= 60) {
            modulovalue = (modulovalue / 60);
            hourmin = hours;
        }
        else {
            hourmin = Min;
        }*/
        if (modulovalue < 60) {
            hourmin = Min;
            strTime = currTime[0] + "" + currTime[1];
        }
        else {
            modulovalue = (modulovalue / 60);
            hourmin = hours;
            strTime = currDate[2] + "" + currTime[0];
        }

        if ((hourmin % modulovalue) == 0 && scriptlivedata.lastTime != strTime) {

            if (scriptlivedata.lastTime.length > 0) { //Update data to chart.
                //console.log("Update data to chart. lastTime: " + scriptlivedata.lastTime + ", current time: " + (currTime[0] + "" + currTime[1]));

                chartList[scriptlivedata.ChartContainer].ChartData.push([Date.UTC(year, month, date, hours, Min, 00), scriptlivedata.open, scriptlivedata.high, scriptlivedata.low, scriptlivedata.close, scriptlivedata.volume]);
                ResetLiveChartData(rowId);
                chartList[scriptlivedata.ChartContainer].acDataTable.addData(chartList[scriptlivedata.ChartContainer].ChartData);
                //setTimeout(plotingChart(scriptlivedata.ChartContainer, chartList[scriptlivedata.ChartContainer].Symbol, true, false), 100);
            }
            else {
                //Chart loaded first time
                //console.log("Chart loaded first time. lastTime: " + scriptlivedata.lastTime + ", current time: " + (currTime[0] + "" + currTime[1]));
            }

            scriptlivedata.open = LTP;
            scriptlivedata.high = LTP;
            scriptlivedata.low = LTP;
            scriptlivedata.close = LTP;
            scriptlivedata.lastTime = strTime;
        }
        else {
            //console.log("Update high, low & close values. lastTime: " + scriptlivedata.lastTime);

            if ($.trim(scriptlivedata.lastTime) == "") { //Chart loaded first time or change in data
                //console.log("Chart loaded first time. lastTime: " + scriptlivedata.lastTime + ", current time: " + (currTime[0] + "" + currTime[1]));

                scriptlivedata.open = LTP;
                scriptlivedata.high = LTP;
                scriptlivedata.low = LTP;
                scriptlivedata.lastTime = strTime;
            }
            else {
                if (scriptlivedata.high < LTP)
                    scriptlivedata.high = LTP;
                if (scriptlivedata.low > LTP)
                    scriptlivedata.low = LTP;
            }

            scriptlivedata.close = LTP;
        }


        liveChartData[rowId] = scriptlivedata;
    }

    return;

    if (scriptlivedata.CandleInterval < 60) {
        if ((Min % scriptlivedata.CandleInterval) == 0 && scriptlivedata.lastTime != (currTime[0] + "" + currTime[1])) {

            if (scriptlivedata.lastTime.length > 0) { //Update data to chart.
                //console.log("Update data to chart. lastTime: " + scriptlivedata.lastTime + ", current time: " + (currTime[0] + "" + currTime[1]));

                chartList[scriptlivedata.ChartContainer].ChartData.push([Date.UTC(year, month, date, hours, Min, second), scriptlivedata.open, scriptlivedata.high, scriptlivedata.low, scriptlivedata.close, scriptlivedata.volume]);
                ResetLiveChartData(rowId);
                chartList[scriptlivedata.ChartContainer].acDataTable.addData(chartList[scriptlivedata.ChartContainer].ChartData);
                //setTimeout(plotingChart(scriptlivedata.ChartContainer, chartList[scriptlivedata.ChartContainer].Symbol, true, false), 100);
            }
            else {
                //Chart loaded first time
                //console.log("Chart loaded first time. lastTime: " + scriptlivedata.lastTime + ", current time: " + (currTime[0] + "" + currTime[1]));
            }

            scriptlivedata.open = LTP;
            scriptlivedata.high = LTP;
            scriptlivedata.low = LTP;
            scriptlivedata.close = LTP;
            scriptlivedata.lastTime = (currTime[0] + "" + currTime[1]);
        }
        else {
            //console.log("Update high, low & close values. lastTime: " + scriptlivedata.lastTime);

            if (scriptlivedata.high < LTP)
                scriptlivedata.high = LTP;
            if (scriptlivedata.low > LTP)
                scriptlivedata.low = LTP;

            scriptlivedata.close = LTP;
        }

        liveChartData[rowId] = scriptlivedata;
    }

    /*if (LTP != null || LTP != undefined) {
        var currTime = new Date().format("HH:MM:ss").split(':');
        var DateTime = new Date();
        var year = DateTime.getFullYear();
        var month = DateTime.getMonth();
        var date = DateTime.getDate();
        var hours = DateTime.getHours();
        var Min = DateTime.getMinutes();
        var second = DateTime.getSeconds();
        if (historyChart == null || historyChart == undefined) {
            historyChart = new Object();
            historyChart.currOpen = LTP;
            historyChart.currHigh = LTP;
            historyChart.currLow = LTP;
            historyChart.currClose = LTP;
            historyChart.currTime = Date.UTC(year, month, date, hours, Min, second);
            //historyChart.currVolume = volume;
            historyChart.LastTradeMin = currTime[0] + "" + currTime[1];
        }
        else {
            if (historyChart.LastTradeMin == (currTime[0] + "" + currTime[1])) {
                if (historyChart.currHigh < LTP)
                    historyChart.currHigh = LTP;
                if (historyChart.currLow > LTP)
                    historyChart.currLow = LTP;
                historyChart.currClose = LTP;
                //historyChart[Token] = currOHLC;
            }
            else {
                //Add new candle chart. Seq: (DateTime, Open, High, Low, Close)
                chartList[chartContainer].ChartData.push([Date.UTC(year, month, date, hours, Min, second), historyChart.currOpen, historyChart.currHigh, historyChart.currLow, historyChart.currClose]);
                //chartList[chartContainer].ChartData.push([new Date().getTime(), historyChart.currOpen, historyChart.currHigh, historyChart.currLow, historyChart.currClose]);
                dataTable.addData(chartList[chartContainer].ChartData);
                console.log(chartList[chartContainer].ChartData);
                historyChart.currOpen = LTP;
                historyChart.currHigh = LTP;
                historyChart.currLow = LTP;
                historyChart.currClose = LTP;
                historyChart.currTime = Date.UTC(year, month, date, hours, Min, second);
                //currOHLC.currVolume = volume;
                historyChart.LastTradeMin = currTime[0] + currTime[1];
                //historyChart[Token] = currOHLC;
            }
        }
    }*/
}

function CreateNewCandle(Token) {
    var currTime = new Date().format("HH:MM:ss").split(':');
    var LastMin = 0;

    var Index = -1;
    for (var i = 0; i < dynamicChartArray.length; i++) {
        if (dynamicChartArray[i].scriptId == Token) {
            LastMin = dynamicChartArray[i].panels[0]._series[0].data[dynamicChartArray[i].panels[0]._series[0].data.length - 1].date.split(' ')[1];
            if (LastMin != null || LastMin != '') {
                LastMin = LastMin.split(':');
            }
            Index = i;
            break;
        }
    }
    if (Index == -1)
        return;
    var period = dynamicChartArray[Index].currCandlePeriod;
    if (period == 1)
        return;
    if (currTime[0] == LastMin[0] && (currTime[1] - LastMin[1]) == period) {
        console.log("CT: " + currTime[0] + " " + currTime[1] + " LT: " + LastMin[0] + " " + LastMin[1]);
        var o = 0, h = 0, l = 0, c = 0, t = 0;
        for (var i = (historyChart[Token].OHLCHistory.length - period) ; i < historyChart[Token].OHLCHistory.length ; i++) {
            if ((historyChart[Token].OHLCHistory.length - period) == i) {
                o = historyChart[Token].OHLCHistory[i].open;
                h = historyChart[Token].OHLCHistory[i].high;
                l = historyChart[Token].OHLCHistory[i].low;
                c = historyChart[Token].OHLCHistory[i].close;
                t = historyChart[Token].OHLCHistory[i].date;
            }
            else {
                if (historyChart[Token].OHLCHistory[i].high > h)
                    h = historyChart[Token].OHLCHistory[i].high;
                else if (historyChart[Token].OHLCHistory[i].low < l)
                    l = historyChart[Token].OHLCHistory[i].low;
                c = historyChart[Token].OHLCHistory[i].close;
                t = historyChart[Token].OHLCHistory[i].date;
            }
        }
        dynamicChartArray[Index].panels[0]._series[0].data.push({
            'date': t,
            'open': parseFloat(o), 'high': parseFloat(h),
            'low': parseFloat(l), 'close': parseFloat(c), 'volume': 0
        });
        if (dynamicChartArray[Index].panels[0]._series[0].data.length > 80) {
            dynamicChartArray[Index].view.startingPoint++;
        }
        else
            dynamicChartArray[Index].view.startingPoint = 0;

        dynamicChartArray[Index].view.endingPoint++;
        dynamicChartArray[Index].draw();
    }
    else if (currTime[0] > LastMin[0]) {

        if ((currTime[1] < LastMin[1])) {
            console.log("CT: " + currTime[0] + " " + currTime[1] + " LT: " + LastMin[0] + " " + LastMin[1]);
            var o = 0, h = 0, l = 0, c = 0, t = 0;
            for (var i = (historyChart[Token].OHLCHistory.length - period) ; i < historyChart[Token].OHLCHistory.length ; i++) {
                if ((historyChart[Token].OHLCHistory.length - period) == i) {
                    o = historyChart[Token].OHLCHistory[i].open;
                    h = historyChart[Token].OHLCHistory[i].high;
                    l = historyChart[Token].OHLCHistory[i].low;
                    c = historyChart[Token].OHLCHistory[i].close;
                    t = historyChart[Token].OHLCHistory[i].date;
                }
                else {
                    if (historyChart[Token].OHLCHistory[i].high > h)
                        h = historyChart[Token].OHLCHistory[i].high;
                    else if (historyChart[Token].OHLCHistory[i].low < l)
                        l = historyChart[Token].OHLCHistory[i].low;
                    c = historyChart[Token].OHLCHistory[i].close;
                    t = historyChart[Token].OHLCHistory[i].date;
                }
            }
            dynamicChartArray[Index].panels[0]._series[0].data.push({
                'date': t,
                'open': parseFloat(o), 'high': parseFloat(h),
                'low': parseFloat(l), 'close': parseFloat(c), 'volume': 0
            });
            if (dynamicChartArray[Index].panels[0]._series[0].data.length > 80) {
                dynamicChartArray[Index].view.startingPoint++;
            }
            else
                dynamicChartArray[Index].view.startingPoint = 0;

            dynamicChartArray[Index].view.endingPoint++;
            dynamicChartArray[Index].draw();
        }
    }

}

function addHistoryData(candle) {

}

function addToken(Token) {
    var objOHLCData = new OHLC();
    historyChart[Token] = objOHLCData;
}

function OHLC() {

    this.OHLCHistory = [];
    this.currOpen = 0;
    this.currHigh = 0;
    this.currLow = 0;
    this.currClose = 0;
    this.currTime = 0;
    this.candlePeriod = 1;
    this.LastTradeMin = 0;
    this.resetOHLCData = function () {
        currOpen = -1;
        currHigh = -1;
        currLow = -1;
        currClose = -1;
        currTime = -1;
        LastTradeMin = 0;
    }
    this.setCandlePeriod = function (t) {
        candlePeriod = t;
    };
    this.changeFormat = function (open, high, low, close, time) {
        var candle = '';
        var date = new Date().format("dd/mm/yy hh:MM:ss");
        candle = {
            'open': parseFloat(open), 'high': parseFloat(high),
            'low': parseFloat(low), 'close': parseFloat(close), 'date': time, 'volume': 0
        };

        return candle;
    }
}

function changeCandlePeriod(Period, Index) {
    var dynamicChart = dynamicChartArray[parseInt(Index)];
    var Token = parseInt(dynamicChart.scriptId);

    if (historyChart.length > 0) {
        dynamicChart.panels[0]._series[0].data = [];
        var temp = 0;
        //  var candleCount = parseInt(historyChart[Token].OHLCHistory.length / Period);
        for (var i = 0; i < historyChart[Token].OHLCHistory.length; i++) {
            var o = 0, h = 0, l = 0, c = 0, t = 0;

            if ((temp + Period) < i || Period > i) {

                for (var k = temp; k < (temp + Period) ; k++) {
                    if (k == temp) {
                        o = historyChart[Token].OHLCHistory[k].open;
                        h = historyChart[Token].OHLCHistory[k].high;
                        l = historyChart[Token].OHLCHistory[k].low;
                        c = historyChart[Token].OHLCHistory[k].close;
                        t = historyChart[Token].OHLCHistory[k].date;
                    }
                    if (historyChart[Token].OHLCHistory[k].high > h)
                        h = historyChart[Token].OHLCHistory[k].high;
                    else if (historyChart[Token].OHLCHistory[k].low < l)
                        l = historyChart[Token].OHLCHistory[k].low;
                    c = historyChart[Token].OHLCHistory[k].close;
                    t = historyChart[Token].OHLCHistory[k].date;
                }
                temp = k;

                dynamicChart.panels[0]._series[0].data.push({
                    'date': t,
                    'open': parseFloat(o), 'high': parseFloat(h),
                    'low': parseFloat(l), 'close': parseFloat(c), 'volume': 0
                });
            }
        }
        dynamicChart.currCandlePeriod = parseInt(Period);
        dynamicChart.view.startingPoint = 0;
        dynamicChart.view.endingPoint = dynamicChart.panels[0]._series[0].data.length - 1;
        dynamicChart.draw();

    }
}

function findActiveScript() {
    var token = '';
    token = $(".tractive")[0].id.split('#')[1];
    return token;
}

//function LoadHistoryData(chartContainer, Exchange, token, symbol, minute, Chart, datatable) {
function LoadHistoryData(chartContainer, symbol, sdate, edate, isUdpate, minute) {
	var check_date=sdate;
	var ddlDataPeriod=chartList[chartContainer].idddlDataPeriod;
	var interval_check=new Date(edate.getFullYear(), edate.getMonth(), edate.getDate() - 1);
	if(minute==5 && check_date>interval_check)
	{
		sdate = new Date(edate.getFullYear(), edate.getMonth(), edate.getDate() - 1);
	}

	var interval_check=new Date(edate.getFullYear(), edate.getMonth(), edate.getDate() - 7 );
	if(minute==15||minute==30)
	{

		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"1week\">1 Week</option><option value=\"1month\">1 Month</option><option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";

	}
	if((minute==15||minute==30) && check_date>interval_check)
	{
		sdate = new Date(edate.getFullYear(), edate.getMonth(), edate.getDate() - 7 );
		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"1week\">1 Week</option><option value=\"1month\">1 Month</option><option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";
		document.getElementById(ddlDataPeriod).value ="1week";
	}
	var interval_check= new Date(edate.getFullYear(), edate.getMonth() - 1, edate.getDate() + 1);
	if(minute==45||minute==60)
	{


		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"1month\">1 Month</option><option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";

	}
	if((minute==45||minute==60)&& check_date>interval_check)
	{

		sdate = new Date(edate.getFullYear(), edate.getMonth() - 1, edate.getDate() + 1);
		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"1month\">1 Month</option><option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";
		document.getElementById(ddlDataPeriod).value ="1month";
	}
	var interval_check= new Date(edate.getFullYear(), edate.getMonth() - 1, edate.getDate() + 1);
	if(minute==120||minute==240)
	{


		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"1month\">1 Month</option><option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";

	}
	if((minute==120||minute==240)&& check_date>interval_check)
	{

		sdate = new Date(edate.getFullYear(), edate.getMonth() - 1, edate.getDate() + 1);
		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"1month\">1 Month</option><option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";
		document.getElementById(ddlDataPeriod).value ="1month";
	}
	var interval_check=new Date(edate.getFullYear(), edate.getMonth() - 3, edate.getDate() + 1);
	if(minute==480)
	{

		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";

	}
	if(minute==480&& check_date>interval_check)
	{
		sdate = new Date(edate.getFullYear(), edate.getMonth() - 3, edate.getDate() + 1);
		document.getElementById(ddlDataPeriod).innerHTML="<option value=\"3month\">3 Month</option><option value=\"6month\">6 Month</option><option value=\"1year\">1 year</option>";
		document.getElementById(ddlDataPeriod).value ="3month";
	}
    var chartObject = chartList[chartContainer];
    var Exchange = chartObject.Exchange;
    var token = chartObject.TokenNo;
    var Symbol = chartObject.Symbol;
    //var minute = chartObject.Minute;
    sdate.setHours(00);
    sdate.setMinutes(00);
    sdate.setSeconds(00);
    var Startdate = dateFormat(sdate, "dd mmm yyyy HH:MM");
    edate.setHours(23);
    edate.setMinutes(59);
    edate.setSeconds(59);
	//document.write(LoginId+"_"+Exchange+"_"+Symbol+"_"+Startdate+"_"+Enddate+"_"+minute);
    var Enddate = dateFormat(edate, "dd mmm yyyy HH:MM");
	//document.write(LoginId+"_"+Exchange+"_"+Symbol+"_"+Startdate+"_"+Enddate+"_"+minute);
    jQuery.support.cors = true;
    $.ajax({
        type: "POST",
        url: 'http://115.112.230.27:8004/api/TCService/GetDateWiseSymbolData',
        //url: 'http://115.112.230.27:8004/api/TCService/GetXMinDateWiseSymbolDataCompress',
        data: jQuery.param(
            {
                "LoginId": LoginId,
                "GatewayId": Exchange,
                "Exchange": Exchange,
                "Symbol": Symbol,
                "StartTime": Startdate,
                "EndTime": Enddate ,
                "minute": minute

            }
        ),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "json",
        success: function (data) {
            $('#' + chartList[chartContainer]["BtnLoad"]).hide();
            var _HistoryData = [];
            for (var i = 0; i < data.lstOHLC.length; i++) {
                //var DateTimeMydate = new Date(data.lstFullBroadcast[i].TradeTime).format("dd mmm yyyy HH:mm:ss");
                var DateTimeMydate = new Date(data.lstOHLC[i].TradeTime);
                var year = DateTimeMydate.getFullYear();
                var month = DateTimeMydate.getMonth();
                var day = DateTimeMydate.getDate();
                var hour = DateTimeMydate.getHours()
                var minute = DateTimeMydate.getMinutes();
                var second = DateTimeMydate.getSeconds();

                /*if (hour <= 9) {
                    if (minute < 15) {
                        continue;
                    }
                }*/

                //_HistoryData.push([Date.UTC(year, month, day, hour, minute, second),
                _HistoryData.push([Date.UTC(year, month, day, hour, minute),//second is removed from date
                    parseFloat(data.lstOHLC[i].Open),
                    parseFloat(data.lstOHLC[i].High),
                    parseFloat(data.lstOHLC[i].Low),
                    parseFloat(data.lstOHLC[i].Close),
                    data.lstOHLC[i].Volume]);

                //console.log("Date: " + DateTimeMydate + "   O: " + data.lstOHLC[i].Open + "   H: " + data.lstOHLC[i].High + "   L: " + data.lstOHLC[i].Low + "   C: " + data.lstOHLC[i].Close);
            }
            if (chartList[chartContainer].HistoryData != null) {
                chartList[chartContainer].HistoryData = [];
            }
            if (chartList[chartContainer].ChartData != null) {
                chartList[chartContainer].ChartData = [];
            }
            //chartList[chartContainer].HistoryData = _HistoryData;
            chartList[chartContainer].ChartData = _HistoryData;
            plotingChart(chartContainer, symbol, isUdpate, true);
            //sdate = sdate.setDate(sdate.getDate() + 1);
            //LoadHistoryData(chartContainer, symbol, sdate, edate, isUdpate, minute);
        },
        failure: function (response) {
        },
        complete: function () {
            $('#' + chartList[chartContainer]["BtnLoad"]).hide();
        },
        beforeSend: function () {
            $('#' + chartList[chartContainer]["BtnLoad"]).show();
        }
    });

}

function addrocketChart(dynamicChart, divname, token, Symbol, iscount) {
    //showhideprogress(true);
    var style = {};
    style.UpColor = { r: 58, g: 242, b: 16 };
    style.DownColor = { r: 255, g: 0, b: 0 };

    // Settings
    var settings = {};
    settings.customUI = false;

    // User created indicator:
    dynamicChart.init($("#" + divname)[0], settings);

    //var googData = [{date: "1/1/2014",open: 1.22,high: 1.6,low: 1.86,close: 1.17,volume: 56218900},
    //				{date: "1/2/2014",open: 1.10,high: 1.4,low: 1.41,close: 1,volume: 56218900}];
    var googData = [];
    if (dynamicChartArray.length > 2) {
        for (var i = 0; i < dynamicChartArray[0].panels[0]._series[0].data.length; i++) {
            googData[i] = dynamicChartArray[0].panels[0]._series[0].data[i];
        }
    }
    // rocketcharts.addSeries(title, data, type, style, panel);

    dynamicChart.scriptId = token;
    historyChart[token].setCandlePeriod(1);

    //var symbol = Symbol; //Symbol Name
    //var googData = historyChart[findActiveScript()].OHLCHistory;
    dynamicChart.addSeries(Symbol, fetchData, "candlesticks", style);

    dynamicChart.view.startingPoint = 0;
    dynamicChart.view.endingPoint = fetchData.length;
    dynamicChart.draw();
    for (var k = 0; k < fetchData.length; k++) {
        historyChart[parseInt(token)].OHLCHistory.push(fetchData[k]);
    }
    if (iscount) {
        count++;
    }
}

function RemoveAllIndicators(type, index) {
    for (var i = dynamicChartArray[index].indicatorIndex.length - 1; i >= 0; i--) {
        //if (dynamicChartArray[index]._indicators.id.indexOf(type) != -1)
        //    dynamicChartArray[index].removeIndicator(i);
        //else if (type == '')
        dynamicChartArray[index].removeIndicator(i);
    }
}

function SaveText(index) {
    if (dynamicChartArray[index].drawType == 'ANNO') {
        dynamicChartArray[index].isDraw = false;
        dynamicChartArray[index].cText = $("#att_annotation")[0].value;
        $("#dvanno")[0].style.display = 'none';
        $("#dvanno")[0].style["z-index"] = 0;
        $("#panels").unbind("mousemove");
        $("#att_annotation")[0].value = '';
        $("#panels")[0].style.cursor = 'default';
        $("#dvanno")[0].style.left = "0px";
        $("#dvanno")[0].style.top = "0px";
        // self.drawType = '';
        dynamicChartArray[index].clearHUD();
    }
    //for (var i = 0; i < rocketchart1.panelOverlays.length; i++) {
    //    // grab the datacontext of the canvas
    //    var context = rocketchart1.panelOverlays[i].getContext("2d");
    //    var imageData = context.createImageData(context.canvas.width, context.canvas.height);
    //    rasterText(imageData, $("#att_annotation")[0].value, $("#dvanno")[0].style.left, $("#dvanno")[0].style.top);
    //}
};
function CloseAnno() {
    $("#dvanno")[0].style.display = 'none';
    $("#dvanno")[0].style["z-index"] = 0;
    $("#panels").unbind("mousemove");
}
function drawGridLines(can) {
    numSamples = 10;
    maxVal = 120;
    minVal = -30;
    var stepSize = 10;
    var colHead = 30;
    var rowHead = 60;
    var margin = 0;
    ctx = can.getContext("2d");
    ctx.fillStyle = "black"
    ctx.font = "14pt Helvetica"
    // set vertical scalar to available height / data points
    yScalar = (can.height - colHead - margin) / (maxVal - minVal);
    // set horizontal scalar to available width / number of samples
    xScalar = (can.width - rowHead) / numSamples;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; // light blue lines
    ctx.beginPath();
    // print  column header and draw vertical grid lines
    for (i = 1; i <= numSamples; i++) {
        var x = i * xScalar;

        ctx.moveTo(x, colHead);
        ctx.lineTo(x, can.height - margin);
    }
    // print row header and draw horizontal grid lines
    var count = 0;
    for (scale = maxVal; scale >= minVal; scale -= stepSize) {
        var y = colHead + (yScalar * count * stepSize);
        ctx.moveTo(rowHead, y)
        ctx.lineTo(can.width, y)
        count++;
    }
    ctx.stroke();
}

function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };