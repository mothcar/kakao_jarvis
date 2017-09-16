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
