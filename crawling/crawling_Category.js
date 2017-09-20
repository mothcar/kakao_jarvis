<<<<<<< HEAD
var cheerio = require('cheerio');
var request = require('request');

exports.search=function(word){
  var url = "http://shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //HTML body
        var $ = cheerio.load(body);
        var jbAry = new Array();
       	if($("div").hasClass("finder")==true){
		$(".depth").first().each(function(idx,el){
	        	jbAry = $(el).text().trim();
		});
	        resolve(jbAry.replace( /(\s*)/g, ""));
	}else{
		resolve('없음');
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
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //HTML body
        var $ = cheerio.load(body);
        var jbAry = new Array();
        $(".depth").first().each(function(idx,el){
        	jbAry = $(el).text().trim();
	})
        resolve(jbAry.replace( /(\s*)/g, ""));

      }
    });
  });
};

>>>>>>> 1c9b6e4c011285869c763d4e7a3a6b9da53e28b6
