
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
	
	showTab();
}

function setErrorMessage(string)
{
	document.getElementById("errormsg").innerHTML = string;
	setTimeout(function() {document.getElementById("errormsg").innerHTML = "";}, 1000);
}

function changePassword() {
	var old_password = document.forms["changePasswordForm"]["old_password"].value;
	var new_password1 = document.forms["changePasswordForm"]["new_password1"].value;
	var new_password2 = document.forms["changePasswordForm"]["new_password2"].value;
	
	if(new_password1 != new_password2) {
		//alert("The new password fields don't match");
		setErrorMessage("Password doesn't match!");
		return false;
	}
	else if(new_password1.length < 8) {
		setErrorMessage("The new password is too short");
		return false;
	}
	else {
		// FLASK HERE
		var result = serverstub.changePassword(localStorage.getItem("token"), old_password, new_password1);
		setErrorMessage(result.message);
		//return result.success;
	}

	return false;
}

function logout() {
	var token = localStorage.getItem("token");
	var result = serverstub.signOut(token);
	
	setErrorMessage(result.message);
	localStorage.removeItem("token");
	loadView(token);

	return false;
}

function validateLoginForm() {	
	var email = document.forms["loginForm"]["email"].value;
	var password = document.forms["loginForm"]["password"].value;
	
	var result = serverstub.signIn(email, password);

	setErrorMessage(result.message);
	 
	if(result.success == true) { 
		localStorage.setItem("token", result.data);	 
		loadView();	 
		//return true;
	}
	else	 
		return false;
	
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

		setErrorMessage(result.message);	 
		
		//return true;
	}
	else {
		setErrorMessage("Password is incorrect or less than 8 characters");
		return false;
	}

	return false;
}

function browseUser() {
	var email = document.forms["browseUserForm"]["email"].value;
	
	var result = serverstub.getUserDataByEmail(localStorage.getItem("token"), email);
	
	if (result.success == false) {
		setErrorMessage("No user found");
	}

	var user = result.data;
	
	document.getElementById("firstname_b").innerHTML = user.firstname;
	document.getElementById("lastname_b").innerHTML = user.familyname;
	document.getElementById("email_b").innerHTML = user.email;
	document.getElementById("gender_b").innerHTML = user.gender;
	document.getElementById("city_b").innerHTML = user.city;
	document.getElementById("country_b").innerHTML = user.country;
	
	document.getElementById("userInfo_b").style.display = "block";
	
	// add messages to the wall
	// FLASK HERE
	var messages = serverstub.getUserMessagesByEmail(localStorage.getItem("token"), email).data;
	
	document.getElementById("messageWall_b").innerHTML = "";
	for (i = 0; i < messages.length; i++) { 
		document.getElementById("messageWall_b").innerHTML += messages[i].writer + ": ";
		document.getElementById("messageWall_b").innerHTML += messages[i].content + "<br\><br\>";
	}
	
	return false;
}

function showTab()
{
	var tab = localStorage.getItem("tab");
	
	if(tab == "home") {
		showHome();
	}
	else if(tab == "browse") {
		showBrowse();
	}
	else if(tab == "account") {
		showAccount();
	}
}

function postMessage() 
{
	var message = document.forms["postMessageForm"]["message"].value;
	
	// FLASK HERE
	
	var email = serverstub.getUserDataByToken(localStorage.getItem("token")).data.email;
	var result = serverstub.postMessage(localStorage.getItem("token"), message, email);

	loadView();

	return false;
}

function showHome()
{
	localStorage.setItem("tab", "home");
	
	document.getElementById("home").style.display = "block";
	document.getElementById("browse").style.display = "none";
	document.getElementById("account").style.display = "none";

	document.getElementById("nav_home").style.color = "black";
	document.getElementById("nav_browse").style.color = "red";
	document.getElementById("nav_account").style.color = "red";
	
	// FLASK HERE
	
	var user = serverstub.getUserDataByToken(localStorage.getItem("token")).data;
	
	document.getElementById("firstname").innerHTML = user.firstname;
	document.getElementById("lastname").innerHTML = user.familyname;
	document.getElementById("email").innerHTML = user.email;
	document.getElementById("gender").innerHTML = user.gender;
	document.getElementById("city").innerHTML = user.city;
	document.getElementById("country").innerHTML = user.country;
	
	// add messages to the wall
	
	// FLASK HERE
	
	var messages = serverstub.getUserMessagesByToken(localStorage.getItem("token")).data;
	
	document.getElementById("messageWall").innerHTML = "";
	
	for (i = 0; i < messages.length; i++) { 
		document.getElementById("messageWall").innerHTML += messages[i].writer + ": ";
		document.getElementById("messageWall").innerHTML += messages[i].content + "<br\><br\>";
	}

	return false;
}

function showBrowse()
{
	localStorage.setItem("tab", "browse");
	
	document.getElementById("home").style.display = "none";
	document.getElementById("browse").style.display = "block";
	document.getElementById("account").style.display = "none";	

	document.getElementById("nav_home").style.color = "red";
	document.getElementById("nav_browse").style.color = "black";
	document.getElementById("nav_account").style.color = "red";
}

function showAccount()
{
	localStorage.setItem("tab", "account");
	
	document.getElementById("home").style.display = "none";
	document.getElementById("browse").style.display = "none";
	document.getElementById("account").style.display = "block";

	document.getElementById("nav_home").style.color = "red";
	document.getElementById("nav_browse").style.color = "red";
	document.getElementById("nav_account").style.color = "black";
}
