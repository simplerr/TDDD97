
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

function validateLoginForm() {
	var email = document.forms["loginForm"]["email"].value;
	var password = document.forms["loginForm"]["password"].value;
	
	var result = serverstub.signIn(email, password);
	
	alert(result.message);
	
	if(result.success == true) {
		localStorage.setItem("token", result.data);
		loadView();
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

function showHome()
{
	document.getElementById("home").style.display = "block";
	document.getElementById("browse").style.display = "none";
	document.getElementById("account").style.display = "none";
}

function showBrowse()
{
	document.getElementById("home").style.display = "none";
	document.getElementById("browse").style.display = "block";
	document.getElementById("account").style.display = "none";
}

function showAccount()
{
	document.getElementById("home").style.display = "none";
	document.getElementById("browse").style.display = "none";
	document.getElementById("account").style.display = "block";
}