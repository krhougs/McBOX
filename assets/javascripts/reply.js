$(document).ready(function(){ 
var converter1 = Markdown.getSanitizingConverter();
var editor1 = new Markdown.Editor(converter1);
editor1.run();
$("#r_submit").click(function(){
	  $.post("/topic/reply/new",$("form").serialize(),function(result){
  		  if(result == "true") {
  		  	location.reload() 
  		  }
  		  else {
  		  	$("#r_submit")[0].innerHTML='请先填写上面的表单';
  		  }
});
});
});
