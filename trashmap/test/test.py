'''
 카카오 geodata 가져오기 
 error  구분은 if ( 'error_type' in r )
 위도, 경도 위치는 
 r['documents'][0]['road_address']['x']
 r['documents'][0]['road_address']['y']
'''

import requests
import json
import pandas as pd
import urllib
import openpyxl

def getGPS_coordinate_for_KAKAO(address, MYAPP_KEY):
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'KakaoAK {}'.format(MYAPP_KEY)
    }
    address = address.encode("utf-8")
    p = urllib.parse.urlencode(
        {
            'query': address
        }
    )
    result = requests.get("https://dapi.kakao.com/v2/local/search/address.json", headers=headers, params=p)
    return result.json()

#MyAPP_KEY는 카카오 developer에서 REST API 키를 받아오면 된다. 


# 현재 스크립트와 같은 폴더에 위치한 엑셀 파일을 읽어옵니다.
wb = openpyxl.load_workbook('rt.xlsx')

# 엑셀 파일 내 모든 시트 이름을 출력합니다.
#print(wb.sheetnames)

# 활성화된 시트를 새로운 변수에 할당합니다.
sheet = wb.active

# 시트 제목을 출력합니다.
#print(sheet['A1'].value)

addr_book = []
for i in sheet.rows:
    get_load = i[2].value
    get_addr = i[3].value
    result = isinstance(get_addr,str)
    if result:
        addr = get_addr
    else:
        addr = str(get_load) + ' ' + str(get_addr)
    addr_book.append(addr)

idx = 0    
for addr in addr_book:
    a = getGPS_coordinate_for_KAKAO(addr, "66931185a093f52d46306e8486e8398c")
    print(type(addr))
    if a['documents'] != []:
        if a['documents'][0]['road_address'] != None:
            idx = idx+1
            print(a['documents'][0]['road_address']['x'])
            print(a['documents'][0]['road_address']['y'])
print (idx)