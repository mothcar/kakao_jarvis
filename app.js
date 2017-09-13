var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
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
    console.log(_obj.content);

    if (_obj.content == '키워드 조회') {
        let massage = {
            "message": {
                "text": explanation
            },
            "keyboard": {
              type: 'buttons',
              buttons: ["청바지","소고기","종료"]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
    } else if(_obj.content == '종료') {
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
    }else {
        let massage = {
            "message": {
                "text": '저는 몰라요'
            },
            "keyboard": {
              type: 'buttons',
              buttons: ["청바지","소고기","종료"]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
    }
});
