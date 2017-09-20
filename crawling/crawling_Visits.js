<<<<<<< HEAD
var cheerio = require('cheerio');
var request = require('request');

exports.search=function(word){
  var url = "http://storefarm.naver.com/"+encodeURIComponent(word);
  var visits;
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //HTML body
          var $ = cheerio.load(body);
    	 // if($('dl').hasClass(".not_shopn")==true || $('dl').hasClass(".not_page")==true || $('dl').hasClass(".not_shop2")==true){
	if($("div").hasClass("error_area")==true){
		resolve(false);
	}else{console.log('success');
	  var Seller_Unique_Number = $(".sellershop_identity div p a").attr("class").replace(/[^0-9]/g,"");
          var url2 = "http://storefarm.naver.com/main/ajax/status?sellerShopNo="+parseInt(Seller_Unique_Number);
          request(url2,function(error,response,body){
            if (!error && response.statusCode == 200) {
              visits = JSON.parse(body);
              resolve(visits);
            }
          });
 	 }
        }
    });
  });
}
=======
var cheerio = require('cheerio');
var request = require('request');

exports.search=function(word){
  var url = "http://storefarm.naver.com/"+encodeURIComponent(word);
  var visits;
  return new Promise(function(resolve,reject){
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //HTML body
          var $ = cheerio.load(body);
          var Seller_Unique_Number = $(".sellershop_identity div p a").attr("class").replace(/[^0-9]/g,"");
          var url2 = "http://storefarm.naver.com/main/ajax/status?sellerShopNo="+parseInt(Seller_Unique_Number);
          request(url2,function(error,response,body){
            if (!error && response.statusCode == 200) {
              visits = JSON.parse(body);
              resolve(visits);
            }
          });
        }
    });
  });
}
>>>>>>> 1c9b6e4c011285869c763d4e7a3a6b9da53e28b6
