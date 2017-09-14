var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();

//설명글 텍스트 파일 로드
const fs = require('fs');
var explanation = fs.readFileSync('explanation.txt', 'utf8');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

console.log('APIs initialize');

//서버를 계속 유지
app.listen(80, function() {
    console.log('Connect 80 port');
});

app.get('/keyboard', (req, res) => {
    const menu = {
        type: 'buttons',
        buttons: ["키워드 조회"]
    };

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(menu));
});


app.post('/message', (req, res) => {

    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };

    //사용자에게 보낼 메세지를 완성할 함수
    var result = resultSet(_obj.content);

    if (_obj.content == '키워드 조회') {
        let massage = {
            "message": {
                "text": explanation
            },
            "keyboard": {
                type: 'text'
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));

    } else if (_obj.content == '종료') {
        let massage = {
            "message": {
                "text": '처음으로 돌아갑니다'
            },
            "keyboard": {
                type: 'buttons',
                buttons: ["키워드 조회"]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));

    } else {
        let massage = {
            "message": {
                "text": result
            },
            "keyboard": {
                type: 'text'
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
    }
});

//사용자에게 보낼 메세지를 완성할 함수
function resultSet(keyword) {
  var result = '';

    //쉼표를 통해 여러 키워드를 입력한 경우
    if (keyword.indexOf(',') != -1) {
        var keywordArray = keyword.split(',');

        for(var index in keywordArray){
          result+=keywordArray[index]+' 검색량 조회 결과\n\n';
        }
    }

    //하나의 키워드만 입력한 경우
    else {
        var keywordOption = keyword.charAt(keyword.length - 1); //옵션 추출

        //기본 검색량 조회
        result = keyword + ' 검색량 조회 결과';

        //검색량+쇼핑 연관검색어 조회
        if (keywordOption == '.') {
            keyword = keyword.substring(0, keyword.length - 1);

            result += '+쇼핑 연관검색어 조회 결과';
        }

        //검색량+스팜상품수+1등상품(광고상품 제외)의 카테고리 조회
        else if (keywordOption == '!') {
            keyword = keyword.substring(0, keyword.length - 1);

            result += '+스팜상품수+1등상품(광고상품 제외)의 카테고리 조회 결과';
        }

        //검색량+스팜효율점수 조회
        else if (keywordOption == '?') {
            keyword = keyword.substring(0, keyword.length - 1);

            result += '+스팜효율점수 조회 결과';
        }
    }

    result += addDate();
    return result;
}

function addDate(){
  var today = new Date();
  var nowy = today.getFullYear();
  var nowm = today.getMonth()+1;
  var nowd = today.getDate();
  if(nowd<10)     nowd='0'+nowd;
  if(nowm<10)     nowm='0'+nowm;

  var pastday = new Date(Date.parse(today)-30*1000*60*60*24);
  var pasty =pastday.getFullYear();
  var pastm =pastday.getMonth()+1;
  var pastd =pastday.getDate();
  if(pastm<10)     pastm='0'+pastm;
  if(pastd<10)     pastd='0'+pastd;

  var result = '\n\n※데이터 통계 기간\n['+ pasty + '/'+ pastm+'/' + pastd + '] ~ [' + nowy + '/' + nowm +'/'+ nowd + ']'

  return result
}
