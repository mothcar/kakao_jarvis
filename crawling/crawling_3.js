var cheerio = require('cheerio');
var request = require('request');

exports.aaa=function(word){
  var url = "http://m.shopping.naver.com/search/all.nhn?query="+encodeURIComponent(word);
  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //HTML body
      var $ = cheerio.load(body);
      var i=0;
      // console.log($(".carousel_scroller"));
      console.log("연관검색어");
      $("._carousel_item").each(function (idx, el) {
        console.log(idx+1+":"+$(el).text().trim());
        if(idx==4) return false;
        });
     }
  })
}
