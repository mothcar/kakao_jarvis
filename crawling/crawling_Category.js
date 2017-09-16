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
          console.log($(el).text().trim());
        })
        resolve(jbAry);

      }
    });
  });
};


}
