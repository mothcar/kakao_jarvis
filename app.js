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
        //사용자에게 보낼 메세지를 완성할 함수
        var result = resultSet(_obj.content);
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
    var keywordOption;
    //쉼표를 통해 여러 키워드를 입력한 경우
    if (keyword.indexOf(',') != -1) {
        var keywordArray = keyword.split(',');

        for (var index in keywordArray) {
            result += keywordArray[index] + ' 검색량 조회 결과\n\n';
        }
    }

    //하나의 키워드만 입력한 경우
    else {
        //옵션 추출
        keywordOption = keyword.charAt(keyword.length - 1);

        //옵션 제외 키워드만 추출
        if (keywordOption == '.' || keywordOption == '!' || keywordOption == '?' || keywordOption == '@')
            keyword = keyword.substring(0, keyword.length - 1);

        //기본 검색량 조회
        //if(keywordOption != '@')
        //  result = searchVolum(keyword);


        //검색량+쇼핑 연관검색어 조회
        if (keywordOption == '.') {
            var Related = require('./crawling/crawling_Related');
            var temp;

            Related.search(keyword)
                .then(result2 => {
                    temp = keyword + " [연관검색어]\n\n1위. " + result2[0] + "\n2위. " + result2[1] + "\n3위. " + result2[2] + "\n4위. " + result2[3] + "\n5위. " + result2[4];
                });
            while (temp == undefined) {
                require('deasync').runLoopOnce();
            }
            result += temp;
        }



        //검색량+스팜상품수+1등상품(광고상품 제외)의 카테고리 조회
        else if (keywordOption == '!') {
            var Spam = require('./crawling/crawling_Spam');
            var Category = require('./crawling/crawling_Category');
            var temp, temp2;

            Spam.search(keyword)
                .then(result2 => {
                    temp = result2;
                    Category.search(keyword)
                        .then(result3 => {
                            temp2 = result3;
                        })
                })
            while (temp == undefined || temp2 == undefined) {
                require('deasync').runLoopOnce();
            }
            result += '[스팜 상품 수]\n'
            result += temp +'개\n\n';
            result += '[카테고리]\n';
            result += temp2;
        }

        //검색량+스팜효율점수 조회
        else if (keywordOption == '?') {


            result += '[스팜 효율 점수]\n';
        }

        //경쟁 스팜 방문자수 조회
        else if (keywordOption == '@') {
            var visits = require('./crawling/crawling_Visits');
            var temp;

            visits.search(keyword)
                .then(result2 => {
                    temp = result2;
                })
            while (temp == undefined) {
                require('deasync').runLoopOnce();
            }
            result += '['+keyword+' 방문자 수]\n';
            result += '총 방문자수 : ';
            result += temp.htReturnValue.total + '명';
            result += '\n오늘 방문자수 : ';
            result += temp.htReturnValue.today + '명';
        }
    }

    if(keywordOption != '@')
      result += addDate();
    return result;
}

//데이터 통계 기간 구하고 결과 메세지에 추가
function addDate() {
    var today = new Date();
    var nowy = today.getFullYear();
    var nowm = today.getMonth() + 1;
    var nowd = today.getDate();
    if (nowd < 10) nowd = '0' + nowd;
    if (nowm < 10) nowm = '0' + nowm;

    var pastday = new Date(Date.parse(today) - 30 * 1000 * 60 * 60 * 24);
    var pasty = pastday.getFullYear();
    var pastm = pastday.getMonth() + 1;
    var pastd = pastday.getDate();
    if (pastm < 10) pastm = '0' + pastm;
    if (pastd < 10) pastd = '0' + pastd;

    var result = '\n\n※데이터 통계 기간\n[' + pasty + '/' + pastm + '/' + pastd + '] ~ [' + nowy + '/' + nowm + '/' + nowd + ']'

    return result;
}


//네이버광고 API가 연결된 파이썬 프로그램 실행
function searchVolum(keyword) {
    var PythonShell = require('python-shell');
    var temp;
    var options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [keyword]
    };

    //콜백함수 동기 처리를 위한 루프
      while(temp == undefined){
        PythonShell.run('keyword.py', options, function(err, results) {
            if (err) throw err;
            temp=results[0]+"\n\n"+results[1]+"\n"+results[2]+"\n"+results[3]+"\n"+results[4];
        });

          require('deasync').runLoopOnce();
      }


      return temp;
}
