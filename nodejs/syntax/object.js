var f = function(){
  console.log(1+1);
  console.log(1+2);
}
var a = [f];
a[0]();

var o = { func:f }
o.func();

//var i = if(true){console.log(1)}; 오류
//var r = while(true){console.log(2)}; 오류
