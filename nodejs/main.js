var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// var 변수명 = require('모듈') 변수명이 해당 모듈을 사용할 것이라고 하는것.

function templateHTML(_title, _list, _body, _control){
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
    ${_control}
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
    //console.log(url.parse(_url, true)); //URL 정보표시

    if(pathname === '/'){
      if(queryData.id === undefined){
        //.id가 아무것도 없다면 여기로 옴. undefined = 정의안되어있다는 뜻
        fs.readdir('./data', function(error, filelist){
          //폴더에있는 파일들을 filelist변수에 배열형식으로 저장함.
          //console.log(filelist); filstlist 출력해보기

          var title = 'Welcome';
          var description = 'Hello, NodeJS';
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`
          , `<a href = "/create">create</a>`);
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
            var template = templateHTML(title, list,
              `<h2>${title}</h2><p>${description}</p>`,
              `<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`);
            response.writeHead(200); //200이 의미하는 것은 파일을 성공적으로 전송했다는 것을 의미
            response.end(template);
          });
        });
      }
    }
    else if(pathname==='/create'){
      fs.readdir('./data', function(error, filelist){
        //폴더에있는 파일들을 filelist변수에 배열형식으로 저장함.
        //console.log(filelist); filstlist 출력해보기

        var title = 'Create_HTML';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>
          <form action="/proccess_create" method="post">
            <p><input type = "text" name = "title" placeholder="title"></p>
            <p>
              <textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
            </p>
            <p>
              <input type = "submit">
            </p>
          </form>
          `, ``) ;
        //console.log(__dirname + _url); url 나오는 것 확인하는 코드
        response.writeHead(200); //200이 의미하는 것은 파일을 성공적으로 전송했다는 것을 의미
        response.end(template);
        //response.end(fs.readFileSync(__dirname + _url));
      });
    }
    else if(pathname ==='/proccess_create'){
      var body = '';
      request.on('data', function(data){
        //데이터를 받아오는데 조각조각 받아옴.
        //조각조각 받아서 콜백함수를 그때마다 호출함.
        body = body + data;
        //그렇기때문에 body = data가 아닌 body에 data를 계속 더하는 방식으로 구현.
        /*if(body.length >1e6){
          request.connection.destroy();
          //너무 많은 정보가 들어오면 request를 파괴함.
        }*/
      });
      request.on('end', function(){
        //데이터가 조각조각 들어오다 더 들어올 데이터가 없으면 콜백함수를 호출. 즉, 정보수신이 끝났다는 뜻
        var post = qs.parse(body);//데이터 객체로 넘어옴
        var description = post.description;
        var title = post.title;
        fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
          response.writeHead(302 , {Location: `/?id=${title}`});//리다이렉션
          response.end();
        });
      });
    }
    else if(pathname ===`/update`){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        fs.readdir('./data', function(error, filelist){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `
            <form action="/proccess_update" method="post">
              <input type = "hidden" name = "id" value = "${title}">
              <p><input type = "text" name = "title" placeholder="title" value = ${title}></p>
              <p>
                <textarea name="description" rows="8" cols="80" placeholder="description" >${description}</textarea>
              </p>
              <p>
                <input type = "submit">
              </p>
            </form>
            `,
            `<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`);
          response.writeHead(200); //200이 의미하는 것은 파일을 성공적으로 전송했다는 것을 의미
          response.end(template);
        });
      });
    }
    else if(pathname ===`/proccess_update`){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var description = post.description;
        var title = post.title;
        var old_title = post.id;
        fs.rename(`./data/${old_title}`,`./data/${title}`,function(err){ //파일 이름 바꾸기
          fs.writeFile('./data/'+title, description,'utf8',function(err){ // 파일 내용 수정
            if (err ===undefined || err == null){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            }
          });
        });
      });
    }
    else{
      response.writeHead(404); //404가 의미하는 것은 올바르지 않다는 것을 의미
      response.end("Not Found 404");
      }
    });
app.listen(3000);
