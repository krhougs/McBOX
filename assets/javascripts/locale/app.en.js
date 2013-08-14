function Login(){
	var user = $("#L_user")[0].value;
	var re =/^[A-Za-z0-9]+$/;
	if(re.test(user)) {
		$("#L_input").removeAttr("disabled");
		$("#L_input")[0].innerHTML='Submit';
		$("#L_input").removeClass("red");
		$("#L_input").addClass("blue");
		$("#ajax_loginstatus").html('');
	}else{
		$("#L_input").attr("disabled","disabled");
		$("#L_input").addClass("red");
		$("#L_input").removeClass("blue");
		$("#L_input")[0].innerHTML='Finish the form first please.';
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
			err1 = "Username only contains sums and Latin alphabets.";
		}
		if (pass == repass) {
			count++;
		}
		else {
			 err2 = "Two passwords doesn't match.";
		}
		if (email_p.test(mail)) {
			count++;
		}
		else {
			err3 = "Invaild E-mail.";
		}
		if (count == 3) {
			$("#R_input").removeAttr("disabled");
			$("#R_input")[0].innerHTML='Submit';
			$("#R_input").removeClass("red");
			$("#R_input").addClass("blue");
			$("#ajax_loginstatus").html('');
		}
		else {
			$("#R_input").attr("disabled","disabled");
			$("#R_input").addClass("red");
			$("#R_input").removeClass("blue");
			$("#R_input")[0].innerHTML='Finish the form first please.';
			$("#ajax_loginstatus").html('<a id="temp_st" style="color:red">' + err1 + err2 + err3 + '</a>');
		}
}
