<<<<<<< HEAD
var cheerio = require('cheerio');
var request = require('request');


exports.search=function(word){
  var jbAry = new Array();
  var url = "http://m.shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      //HTML body
	console.log('Related');
        var $ = cheerio.load(body);
        var i=0;
        $("._carousel_item").each(function (idx, el) {
          jbAry[idx]=$(el).text().trim();
          });
            resolve(jbAry);
       }
    });
  });
}
=======
var cheerio = require('cheerio');
var request = require('request');


exports.search=function(word){
  var jbAry = new Array();
  var url = "http://m.shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      //HTML body
	console.log('Related');
        var $ = cheerio.load(body);
        var i=0;
        $("._carousel_item").each(function (idx, el) {
          jbAry[idx]=$(el).text().trim();
          });
            resolve(jbAry);
       }
    });
  });
}
>>>>>>> 1c9b6e4c011285869c763d4e7a3a6b9da53e28b6
