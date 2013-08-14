function Login(){
	var user = $("#L_user")[0].value;
	var re =/^[A-Za-z0-9]+$/;
	if(re.test(user)) {
		$("#L_input").removeAttr("disabled");
		$("#L_input")[0].innerHTML='提交';
		$("#L_input").removeClass("red");
		$("#L_input").addClass("blue");
		$("#ajax_loginstatus").html('');
	}else{
		$("#L_input").attr("disabled","disabled");
		$("#L_input").addClass("red");
		$("#L_input").removeClass("blue");
		$("#L_input")[0].innerHTML='请先填写上面的表单';
		$("#ajax_loginstatus").html('<a id="temp_st" style="color:red">' + err1 + err2 + err3 + '</a>');
	}
}

function CreatUser(){
		var email_p = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		var user_p =/^[A-Za-z0-9]+$/;
		var count = 0;
		var user = $("#R_user")[0].value;
		var pass = $("#R_pass")[0].value;
		var repass = $("#R_repass")[0].value;
		var mail = $("#R_mail")[0].value;
		var err1 = "";
		var err2 = "";
		var err3 = "";
		if	(user_p.test(user)) {
			count++;
		}
		else {
			err1 = "用户名只能由字母和数字组成。";
		}
		if (pass == repass) {
			count++;
		}
		else {
			 err2 = "两次密码输入不一致。";
		}
		if (email_p.test(mail)) {
			count++;
		}
		else {
			err3 = "邮箱不符合格式。";
		}
		if (count == 3) {
			$("#R_input").removeAttr("disabled");
			$("#R_input")[0].innerHTML='提交';
			$("#R_input").removeClass("red");
			$("#R_input").addClass("blue");
			$("#ajax_loginstatus").html('');
		}
		else {
			$("#R_input").attr("disabled","disabled");
			$("#R_input").addClass("red");
			$("#R_input").removeClass("blue");
			$("#R_input")[0].innerHTML='请先填写上面的表单';
			$("#ajax_loginstatus").html('<a id="temp_st" style="color:red">' + err1 + err2 + err3 + '</a>');
		}
}
$("document").ready(function(){var editor = UE.getEditor('wmd-panel');$("#tk_n_s").click(function(){
	$("#tk_texts")[0].value = editor.getContent();
	$("#tk_f")[0].submit();
});});
