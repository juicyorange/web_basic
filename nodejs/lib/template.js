var template = {
  html:function(_title, _list, _body, _control){
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
  },

  list:function(_filstlist){
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
}

module.exports = template;
