var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var PythonShell = require('python-shell');
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
    var resultobj;
    //옵션 추출
    var keywordOption = keyword.charAt(keyword.length - 1);

    //마지막에 쉼표가 있는 경우
    if (keywordOption == ',') {
        result += '키워드를 다시 입력해 주세요'
    }

    //쉼표를 통해 여러 키워드를 입력한 경우
    else if (keyword.indexOf(',') != -1) {
        var keywordArray = keyword.split(',');

        for (var index in keywordArray) {
            keywordOption = keywordArray[index].charAt(keyword.length - 1);

            if (keywordOption == '.' || keywordOption == '!' || keywordOption == '?' || keywordOption == '@')
                keyword = keywordArray[index].substring(0, keyword.length - 1);
            else
                keyword = keywordArray[index];

            if (index != 0)
                result += '————————————\n'

            resultobj = searchVolum(keyword);
            result += resultobj[0];
        }
    }

    //하나의 키워드만 입력한 경우
    else {
        //옵션 제외 키워드만 추출
        if (keywordOption == '.' || keywordOption == '!' || keywordOption == '?' || keywordOption == '@')
            keyword = keyword.substring(0, keyword.length - 1);

        //기본 검색량 조회
        if (keywordOption != '@') {
            resultobj = searchVolum(keyword);
            result = resultobj[0];
        }

        //검색량+쇼핑 연관검색어 조회
        if (keywordOption == '.') {
            var Related = require('./crawling/crawling_Related');
            var temp;

            Related.search(keyword)
                .then(result2 => {
                    if (result2[0] == undefined) {
                        temp = '\n[쇼핑 연관검색어가 없습니다.]\n';
                    } else {
                        temp = "\n[쇼핑 연관검색어]\n";
                        for (i = 0; i < 5; i++) {
                            if (result2[i] == undefined)
                                break;
                            temp += (i + 1) + "위. " + result2[i] + "\n";
                        }
                    }
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
		if(temp == '')
			temp=0;
            result += '\n[스팜 상품 수]\n'
            result += numberWithCommas(temp) + '개\n\n';
            result += '[카테고리]\n';
            result += temp2 + '\n';
        }

        //검색량+스팜효율점수 조회
        else if (keywordOption == '?') {
            //스팜효율점수: (pc검색량 * 2.4 + 모바일검색량 * 모바일클릭률) / 스팜상품수 * 2
            var Spam = require('./crawling/crawling_Spam');
            var pc = resultobj[1];
            var mobile = resultobj[2];
            var mobileRate = resultobj[4];
            var number, score;

            result += '\n[스팜 효율 점수]\n';

            if (pc == '검색량이 10 이하 입니다.' || mobile == '검색량이 10 이하 입니다.') {
                score = '측정할 수 없습니다.\n'
                result += score;
            } else {
                Spam.search(keyword)
                    .then(result2 => {
                        number = result2;
                    })
                while (number == undefined) {
                    require('deasync').runLoopOnce();
                }
		score = ((pc * 2.4) + (mobile * mobileRate)) / (number * 2);
                result += score.toFixed(2) + '점\n';
            }
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
	    if(temp==false){
		result += '현재 운영되고 있지 않습니다.';
	    }else{
            result += '[스팜 방문자수 조회]\n'
            result += '[' + keyword + ' 방문자 수]\n\n';
            result += '총 방문자수 : ';
            result += numberWithCommas(temp.htReturnValue.total) + '명\n';
            result += '오늘 방문자수 : ';
            result += numberWithCommas(temp.htReturnValue.today) + '명\n';
       	    }
	 }
    }

    if ((keywordOption == '@' && keywordOption == ',') || result=='현재 운영되고 있지 않습니다.' || result=='\n[쇼핑 연관검색어가 없습니다.]\n') 
        return result;

    return result+addDate();
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

    var result = '\n※데이터 통계 기간\n[' + pasty + '/' + pastm + '/' + pastd + '] ~ [' + nowy + '/' + nowm + '/' + nowd + ']'

    return result;
}


//네이버광고 API가 연결된 파이썬 프로그램 실행
function searchVolum(keyword) {
    var PC, mobile, total, mobileRate, searchResult = '';
    var options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [keyword]
    };

    //콜백함수 동기 처리를 위한 루프

    PythonShell.run('./naverad.py', options, function(err, results) {
        if (err) throw err;
        PC = results[0];
        mobile = results[1];
        total = results[2];
        mobileRate = results[3];
    });

    while (PC == undefined || mobile == undefined || total == undefined) {
        require('deasync').runLoopOnce();
    }



    searchResult += '[' + keyword + ']의 검색량 입니다!\n';
    searchResult += 'PC 검색량 : ' + numberWithCommas(PC) + '\n';
    searchResult += '모바일 검색량 : ' + numberWithCommas(mobile) + '\n';
    searchResult += 'Total 검색량 : ' + numberWithCommas(total) + '\n';

    resultobj = [searchResult, PC, mobile, total, mobileRate];

    return resultobj;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
