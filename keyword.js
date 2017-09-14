var https = require('https');
const crypto = require('crypto');
//var request = require('request');

const http_method = 'GET';
const request_uri = '/keywordstool';
const CUSTOMER_ID  = '1125310';
const API_KEY = '010000000047af83ccb256d12031c1e842a87e3c1bb9a4878096687d53c978fa08f6a7534f'
const API_SECRET = 'AQAAAABHr4PMslbRIDHB6EKofjwb7cIBG9AJjKeSNlKqlJJAGQ==';
const TIMESTAMP = new Date().getTime();

const temp = TIMESTAMP+'.'+http_method+'.'+request_uri;
const SIGNATURE = crypto.createHmac('sha256', API_SECRET).update(temp).digest('hex');

var options = {
    host: 'api.naver.com',
    path: request_uri,
    method: http_method,
    headers: {
      'X-Timestamp' : TIMESTAMP,
      'X-API-KEY':API_KEY,
      'X-Customer': CUSTOMER_ID,
      'X-Signature' : SIGNATURE,
      'Content-Type': 'application/json'
    }
};

var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (xml) {
          console.log(xml);
      });
  });
  req.end();
