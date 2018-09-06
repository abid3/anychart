import requests
import json

url = 'http://115.112.230.27:8004/api/TCService/GetDateWiseSymbolData'
post_data = {
             'LoginId': 'hardik',
             'GatewayId': 'NSECM',
             'Exchange': 'NSECM',
             'Symbol': 'RELIANCE',
             'StartTime': '27/8/2018  9:15AM',
             'EndTime': ' 05/9/2018 3:15PM',
             'CandleSize': 1
             }
print("1.ok")
post_response = requests.post(url=url, data=post_data, stream=True)
# If using requests v2.4.2 or later, pass the dict via the json parameter and it will be encoded directly:
print("data")
post_response.raw
post_response.raw.read(10)




# def fetch_labels(self, orderItemIds):
#     url = "http://115.112.230.27:8004/api/TCService/GetDateWiseSymbolData"
#     headers = {'Accept': 'application/octet-stream'}
#     payload = {'orderItemId':','.join(orderItemIds)}
#     post_data = {
#                  'LoginId': 'hardik',
#                  'GatewayId': 'NSECM',
#                  'Exchange': 'NSECM',
#                  'Symbol': 'RELIANCE',
#                  'StartTime': '27/8/2018  9:15AM',
#                  'EndTime': ' 05/9/2018 3:15PM',
#                  'CandleSize': 1
#                  }
#     return self.session.get(url, params=payload, headers=headers, stream=True)