
displayView = function() {
	// whatever
}

window.onload = function() {
	// code that is executed as the page loads
	// you shall put your own sutom code here
	//window.alert("Hello Mr cheeze Cracker");
	
	//localStorage.clear();
	loadView();
}

function loadView() {
	if(localStorage.getItem("token") == null) // not logged in
		document.getElementById("content").innerHTML = document.getElementById("welcomeview").innerHTML;
	else
		document.getElementById("content").innerHTML = document.getElementById("profileview").innerHTML;
}

function changePassword() {
	var old_password = document.forms["changePasswordForm"]["old_password"].value;
	var new_password1 = document.forms["changePasswordForm"]["new_password1"].value;
	var new_password2 = document.forms["changePasswordForm"]["new_password2"].value;
	
	if(new_password1 != new_password2) {
		alert("The new password fields don't match");
		return false;
	}
	else if(new_password1.length < 8) {
		alert("The new password is too short");
		return false;
	}
	else {
		var result = serverstub.changePassword(localStorage.getItem("token"), old_password, new_password1);
		alert(result.message);
		return result.success;
	}
}

function logout() {
	var token = localStorage.getItem("token");
	var result = serverstub.signOut(token);
	alert(result.message);
	localStorage.removeItem("token");
	loadView(token);
}

function validateLoginForm() {
	var email = document.forms["loginForm"]["email"].value;
	var password = document.forms["loginForm"]["password"].value;
	
	var result = serverstub.signIn(email, password);
	
	alert(result.message);
	
	if(result.success == true) {
		localStorage.setItem("token", result.data);
		loadView();
		return true;
	}
	else
		return false;
}

function validateSignupForm() {
    var password1 = document.forms["signupForm"]["password"].value;
	var password2 = document.forms["signupForm"]["password2"].value;
    
	if(password1 === password2 && password1.length >= 8) { // at least 8 characters long
		var newUser = new Object();
		
		newUser.email = document.forms["signupForm"]["email"].value;
		newUser.password = document.forms["signupForm"]["password"].value;
		newUser.firstname = document.forms["signupForm"]["firstname"].value;
		newUser.familyname = document.forms["signupForm"]["familyname"].value;
		newUser.gender = document.forms["signupForm"]["gender"].value;
		newUser.city = document.forms["signupForm"]["city"].value;
		newUser.country = document.forms["signupForm"]["country"].value;

		var result = serverstub.signUp(newUser);
		
		alert(result.message);
	
		return true;
	}
	else
		return false;
}