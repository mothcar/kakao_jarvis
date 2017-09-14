var cheerio = require('cheerio');
var request = require('request');

exports.aaa=function(word){
  var url = "http://storefarm.naver.com/"+encodeURIComponent(word);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //HTML body
        var $ = cheerio.load(body);
        var Seller_Unique_Number = $(".sellershop_identity div p a").attr("class").replace(/[^0-9]/g,"");
        var url2 = "http://storefarm.naver.com/main/ajax/status?sellerShopNo="+parseInt(Seller_Unique_Number);
        request(url2,function(error,response,body){
          if (!error && response.statusCode == 200) {
            var visits = JSON.parse(body);
            console.log("Total 방문자수 : " + visits.htReturnValue.total);
            console.log("Today 방문자수 : " + visits.htReturnValue.today);

          }
        });
      }
  });
}
