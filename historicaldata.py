# importing the requests library
import requests

# defining the api-endpoint
API_ENDPOINT = "http://115.112.230.27:8004/api/TCService/GetDateWiseSymbolData"

# data to be sent to api
data = {
    "LoginId": "SUJIT",
    "GatewayId": "NSECM",
    "Exchange": "NSECM",
    "Symbol": "NIFTY50",
    "StartTime": "27/08/2018 9:15am",
    "EndTime": "29/08/2018 3:15pm",
    "minute": "15"
}

# sending post request and saving response as response object
r = requests.post(url=API_ENDPOINT, data=data)
# extracting response text
pastebin_url = r.json()
print("The pastebin URL is:%s" % pastebin_url)