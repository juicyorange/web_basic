var http = require('http');
var fs = require('fs');
var url = require('url');
// var 변수명 = require('모듈') 변수명이 해당 모듈을 사용할 것이라고 하는것.

function templateHTML(_title, _list, _body){
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${_title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${_list}
    ${_body}
  </body>
  </html>
  `;
  return template;
}

function templateList(_filstlist){
  /*
  var list = `<ul>
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JavaScript">JavaScript</a></li>
  </ul>`
  아래에 위 코드를 반복문 형식으로 변한 -> 훨씬 효율적임!!
  */
  var list = '<ul>';
  var idx = 0;
  while(idx<_filstlist.length){
    list = list+`<li><a href="/?id=${_filstlist[idx]}">${_filstlist[idx]}</a></li>`;
    idx++;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    //console.log(_url); //query string 전체가 받아짐을 알 수 있다.
    var queryData = url.parse(_url, true).query;
    //queryData에는 querystring의 정보들이 객체형식으로 담겨져있다.
    //console.log(queryData.id); //queryData가 객체형식으로 되어있으므로 .id를 하면 id 값이 받아짐을 알 수 있다.
    var pathname = url.parse(_url, true).pathname;
    //console.log(url.parse(_url, true)); URL 정보표시

    if(pathname === '/'){
      if(queryData.id === undefined){
        //.id가 아무것도 없다면 여기로 옴. undefined = 정의안되어있다는 뜻
        fs.readdir('./data', function(error, filelist){
          //폴더에있는 파일들을 filelist변수에 배열형식으로 저장함.
          //console.log(filelist); filstlist 출력해보기

          var title = 'Welcome';
          var description = 'Hello, NodeJS';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`) ;
          //console.log(__dirname + _url); url 나오는 것 확인하는 코드
          response.writeHead(200); //200이 의미하는 것은 파일을 성공적으로 전송했다는 것을 의미
          response.end(template);
          //response.end(fs.readFileSync(__dirname + _url));
        })
      }
      else{
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          fs.readdir('./data', function(error, filelist){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`) ;
            response.writeHead(200); //200이 의미하는 것은 파일을 성공적으로 전송했다는 것을 의미
            response.end(template);
          });
        });
      }
    }
    else{
      response.writeHead(404); //404가 의미하는 것은 올바르지 않다는 것을 의미
      response.end("Not Found 404");
      }
    });
app.listen(3000);
