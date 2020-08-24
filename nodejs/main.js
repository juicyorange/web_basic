var http = require('http');
var fs = require('fs');
var url = require('url');
// var 변수명 = require('모듈') 변수명이 해당 모듈을 사용할 것이라고 하는것.

var app = http.createServer(function(request,response){
    var _url = request.url;
    //console.log(_url); //query string 전체가 받아짐을 알 수 있다.
    var queryData = url.parse(_url, true).query;
    //queryData에는 querystring의 정보들이 객체형식으로 담겨져있다.
    //console.log(queryData.id); //queryData가 객체형식으로 되어있으므로 .id를 하면 id 값이 받아짐을 알 수 있다.
    var title = queryData.id;

    if(_url == '/'){
      _url = '/index.html';
      title = 'welcome';
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    var template =  `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
      <img src="coding.jpg" width="100%">
      </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
      </p>
    </body>
    </html>
    `;

    console.log(__dirname + _url);
    response.end((template));
    //response.end(fs.readFileSync(__dirname + _url));


});
app.listen(3000);
