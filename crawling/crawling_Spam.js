<<<<<<< HEAD
var cheerio = require('cheerio');
var request = require('request');

exports.search=function(word){
  var url = "http://shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);
  var Spam_Product_Number;
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //HTML body
        var $ = cheerio.load(body);
	if($(".snb_all a")){
	 Spam_Product_Number = $(".snb_all a").text().replace(/[^0-9]/g,"");
        resolve(Spam_Product_Number);
	}else{
	resolve(0);
      }
    }
   });
  });
}
=======
var cheerio = require('cheerio');
var request = require('request');

exports.search=function(word){
  var url = "http://shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);
  var Spam_Product_Number;
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //HTML body
        var $ = cheerio.load(body);
        Spam_Product_Number = $(".snb_all a").text().replace(/[^0-9]/g,"");
        resolve(Spam_Product_Number);
      }
    });
  });
}
>>>>>>> 1c9b6e4c011285869c763d4e7a3a6b9da53e28b6
