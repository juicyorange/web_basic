var express = require('express'); //모듈을 로드해오는 코드. 결국엔 express도 모듈이기 때문.
var app = express(); //express는 함수. return 값을 app에 담는다.
var fs = require('fs');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var path = require('path');
var bodyParser = require('body-parser'); //body-parser : express middleware
var compression = require('compression'); //compression : express middleware

/*
app.use 를 통해 bodyParser 미들웨어를 가져오기.
파라미터 부분에 미들웨어가 결과로 들어온다.
해당 코드가 있는 nodejs가 실행될때마다 미들웨어가 결과로 들어온다.
*/
app.use(bodyParser.urlencoded({ extended: false }));

//이렇게하면 하면 자동으로 데이터들이 압축된다.
//전체 express에 적용된다.
app.use(compression());

//fs.readdir 을 위한 미들웨어.
//app.use()를 사용하면 전체 express에 적용되지만, app.get('*', )을 사용하면 get방식으로 데이터를 받는 곳에서만 미들웨어가 적용된다.
app.get('*', function(req, res, next){
  fs.readdir('./data', function(error, filelist){
    req.list = filelist;
    next();
  });
});

//public 디렉토리에 있는 파일들을 모두 받아온다.
//정적인 파일을 서비스할 수 있게 해준다.
app.use(express.static('public'));

//route, routing 라고 한다.
//사용자들이 다양한 path로 들어올때 각 path마다 적당한 응답을 해준다.
//app.get(path, callback(접속자가 들어왔을때 실행될 함수), [, callback ...])
//app.get('/', (req, res) => res.send('Hello World!')) -> 최신방식

app.get('/', function(req, res){
  
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/trash_can2.png" style="width:300px; display:block; margin-top:10px;">
    `,
    `<a href="/create">create</a>`
  );
  res.send(html);
});

app.get('/page/:pageId', function(req, res) { 
  var filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    if(err){
      next(err);
    }
    else{
      var title = req.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(req.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html);
    }
  });
});


app.get('/create', function(req,res){

  var title = 'WEB - create';
  var list = template.list(req.list);
  var html = template.HTML(title, list, `
    <form action="/create" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `, '');
  res.send(html);
});

//url이 같을때 get으로 넘긴것은 get방식으로 넘어가고 post로 넘긴것은 post에게 간다.
app.post('/create', function(req, res){
  /*
  var body = ''; 
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.redirect(302,`/pages/${title}`) ;
      })
  });
  */
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    res.redirect(302,`/page/${title}`) ;
  })
});

app.get('/update/:pageId', function(req, res){
  var filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = req.params.pageId;
    var list = template.list(req.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update/${title}">update</a>`
    );
    res.send(html);
  });
});

app.post('/update_process', function(req, res){
  var post = req.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.redirect(302,`/page/${title}`) 
    })
  });
});

app.post('/delete_process',function(req, res){
  var post = req.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    res.redirect(302,'/');
  });
});

//에러처리 제일 아래다 적어줌. - 미들웨어는 순차적으로 실행되기 떄문이다.
//next()를 실행하지 못하고, 여기까지 온것이면 해당 페이지를 찾지 못한것.
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

//파라미터가 4개있는 미들웨어는 오류를 처리하기 위한 미들웨어로 판단된다.
//이것이 없다면 next(err)에서 그냥 바로 페이지에 오류를 출력한다
//이것은 오류를 처리하기 위한 미들웨어이다.
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

//서버가 비로소 여기에서 열린다. listen이 성공적으로 되면 function안에 있는 기능 수행.
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

/* express 모듈 없이 node.js로 웹페이지 서버를 통해 열기.
var http = require('http');
var fs = require('fs');
var url = require('url');
var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
      } else {
        fs.readdir('./data', function(error, filelist){

      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
   
    } else if(pathname === '/update'){
     
      });
    } else if(pathname === '/update_process'){
      
      });
    } else if(pathname === '/delete_process'){
  
});
app.listen(3000);
*/