var cheerio = require('cheerio');
var request = require('request');

exports.aaa=function(word){
  var url = "http://shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);

  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //HTML body
      var $ = cheerio.load(body);
      var Spam_Product_Number = $(".snb_all a").text().replace(/[^0-9]/g,"");
      console.log("스팜 상품수 : " + Spam_Product_Number);

      var jbAry = new Array();
      $(".depth").first().each(function(idx,el){
        console.log($(el).text().trim());
      })
    //  $(".depth a").first().each(function (idx, el) {
    //    console.log($(this).text()+'>');
    // });
    }
  });
};

exports.a=function(word){
  var url = "http://shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word)+"&cat_id=&frm=NVSHATC";
  var Spam_Product_Number;
  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //HTML body
      var $ = cheerio.load(body);
      Spam_Product_Number = $(".snb_all a").text().replace(/[^0-9]/g,"");
      console.log(Spam_Product_Number);
    }
  });
}
