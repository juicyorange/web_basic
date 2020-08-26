var fs = require('fs');

//readFile을 통한 Sync와 Async 비교
//readFileSync(동기식)
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');

//readFile(비동기식)
console.log('A');
//readfile의 3번째 인자 함수 : callback
var result = fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
//function 1번째 파라미터 : 에러가있다면 에러를 인자를 제공. 2번째 파라미터 : 파일의 내용을 인자로써 공급해줌
console.log(result);
});
console.log('C');
