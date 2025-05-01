import requests
import pprint

url = "https://api.data.gov.my/data-catalogue?id=cpi_state&sort=-date&limit=1" 

response_json = requests.get(url=url).json()

#latest_date = response_json['date']
pprint.pprint(response_json)
print(response_json[0]['date'])