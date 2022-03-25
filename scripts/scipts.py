# import urllib library
from urllib.request import urlopen

# from web3 import Web3
import json
import datetime

from dotenv import load_dotenv
load_dotenv('../.env')

import os

NODE = os.getenv('node')
CONTRACT_ADDRESS = '0xD6a97fb13711C78Ca7522EA78a1e6A00181CE6a1' # os.getenv('address')
print (NODE)

today = datetime.datetime.now()
url = 'https://api.beta.tab.com.au/v1/tab-info-service/racing/dates/{0}-0{1}-{2}/meetings?jurisdiction=QLD'
print (url.format(today.year, today.month, today.day))

response = urlopen(url.format(today.year, today.month, today.day))
data_json = json.loads(response.read())
  
# print the json response
print(data_json)

# w3 = Web3(Web3.WebsocketProvider(NODE))

# with open('./build/contracts/Horse.json') as json_file:
#   data = json.load(json_file)
#   abi=data['abi']
#   bytecode=data['bytecode']

#   # print(abi)

#   contract = w3.eth.contract(CONTRACT_ADDRESS, abi=abi)
#   count = contract.functions.count().call()
#   print (count)