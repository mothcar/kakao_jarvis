#-*- coding: utf-8 -*-
import pycurl
import hmac, hashlib, base64, time, urllib, json, sys
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
# c = pycurl.Curl()
# c.setopt(pycurl.SSL_VERIFYPEER, 0)
# c.setopt(pycurl.SSL_VERIFYHOST, 0)
# c.setopt(c.WRITEDATA, buf)
# url = baseURL + "/keywordstool?hintKeywords=" + urllib.quote(sys.argv[1])
# c.setopt(c.URL, url)
# c.setopt(pycurl.HTTPHEADER, ['X-API-KEY: '+ apiKey,
#                                    'X-Customer: ' + apiCustomerID,
#                                    'X-Timestamp: ' + str(int(time.time())),
#                                    'X-Signature: ' + signature])
# c.perform()
#
# body = buf.getvalue()
#
# data = json.loads(body)
#
#
# keyword = data["keywordList"][0]["relKeyword"]
# PC = data["keywordList"][0]["monthlyPcQcCnt"]
# mobile = data["keywordList"][0]["monthlyMobileQcCnt"]
# Total = PC+mobile

blog = 1
PC =2
mobile =3
Total = 4

#print(cListByIds)
print ("[%s]의 검색량 입니다!\n블로그 문서량 : %d\n모바일 검색량 : %d\nPC검색량 : %d\nToTal 검색량 : %d\n" % (sys.argv[1],blog,mobile,PC,Total))
