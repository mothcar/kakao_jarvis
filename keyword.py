# -*- coding: utf-8 -*-
import sys
#import json
#from powernad.API import Campaign
from powernad.API import RelKwdStat

BASE_URL = 'https://api.naver.com';
CUSTOMER_ID  = '1125310';
API_KEY = '010000000047af83ccb256d12031c1e842a87e3c1bb9a4878096687d53c978fa08f6a7534f'
API_SECRET = 'AQAAAABHr4PMslbRIDHB6EKofjwb7cIBG9AJjKeSNlKqlJJAGQ==';



rel = RelKwdStat(BASE_URL, API_KEY, API_SECRET, CUSTOMER_ID)

#cList = campaign.get_campaign_list()
#cListByIds = campaign.get_campaign_list_by_ids(cList[0].nccCampaginId)


blog = 1
mobile = 2
PC = 3
Total = 4

#print(cListByIds)
print ("[%s]의 검색량 입니다!\n블로그 문서량 : %d\n모바일 검색량 : %d\nPC검색량 : %d\nToTal 검색량 : %d\n" % (sys.argv[1],blog,mobile,PC,Total))
