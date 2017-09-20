#-*- coding: utf-8 -*-
import pycurl, hmac, hashlib, base64, time, json, sys, urllib.parse
from io import BytesIO

def getSignature(secret, method, path):
    message = str(int(time.time())) + "." + method + "." + path
    dig = hmac.new(secret, msg=bytearray(message, 'utf-8'), digestmod=hashlib.sha256).digest()
    sig = base64.b64encode(dig)
    return sig

baseURL = "https://api.naver.com"
apiSecret = b"AQAAAABHr4PMslbRIDHB6EKofjwb7cIBG9AJjKeSNlKqlJJAGQ=="
apiKey = "010000000047af83ccb256d12031c1e842a87e3c1bb9a4878096687d53c978fa08f6a7534f"
apiCustomerID = "1125310"

signature = getSignature(apiSecret, "GET", "/keywordstool")

buf = BytesIO()

c = pycurl.Curl()
c.setopt(pycurl.SSL_VERIFYPEER, 0)
c.setopt(pycurl.SSL_VERIFYHOST, 0)
c.setopt(c.WRITEDATA, buf)
url = baseURL + "/keywordstool?hintKeywords=" + urllib.parse.quote(sys.argv[1])
c.setopt(c.URL, url)

c.setopt(pycurl.HTTPHEADER, ['X-API-KEY: '+ apiKey,
                                   'X-Customer: ' + apiCustomerID,
                                   'X-Timestamp: ' + str(int(time.time())),
                                   'X-Signature: ' + signature.decode('utf-8')])

c.perform()

body = buf.getvalue()

data = json.loads(body.decode('utf-8'))

PC = data["keywordList"][0]["monthlyPcQcCnt"]
mobile = data["keywordList"][0]["monthlyMobileQcCnt"]
mobileRate=data["keywordList"][0]["monthlyAveMobileCtr"]

if (PC == '< 10') and (mobile == '< 10'):
    PC = '검색량이 10 이하 입니다.'
    mobile = '검색량이 10 이하 입니다.'
    Total = '검색량이 10 이하 입니다.'

elif PC == '< 10' and mobile != '< 10':
    PC = '검색량이 10 이하 입니다.'
    Total = mobile

elif mobile == '< 10' and PC != '< 10':
    mobile = '검색량이 10 이하 입니다.'
    Total = PC

else:
    Total = PC+mobile

print(PC)
print(mobile)
print(Total)
print(mobileRate)
