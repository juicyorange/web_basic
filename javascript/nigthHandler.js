
function nighthandler(self)
{
  var target = document.querySelector('body');
  if(self.value ==='day')
  {
    target.style.backgroundColor ='white';
    target.style.color ='black';
    self.value = 'night';
    var alist = document.querySelectorAll('a');
    var idx = 0;
    while(idx<alist.length)
    {
      alist[idx].style.color ='powderblue';
      idx++;
    }
  }
  else
  {
    target.style.backgroundColor ='black';
    target.style.color ='white';
    self.value = 'day';
    var alist = document.querySelectorAll('a');
    var idx = 0;
    while(idx<alist.length)
    {
      alist[idx].style.color ='blue';
      idx++;
    }
  }
}
