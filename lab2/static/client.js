
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
		// Call Flask function here
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "/change_password", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				// Login processed by Flask
				//var result = JSON.parse(xhttp.responseText);			
				
				alert(xhttp.responseText);			
			}
		};
		
		var token = localStorage.getItem("token");
		xhttp.send("token="+token+"&old_password="+old_password+"&new_password="+new_password1);
		
		return false;
	}
}

function logout() {
	var token = localStorage.getItem("token");
	
	// Call Flask function here
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/sign_out", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// Login processed by Flask
			var result = JSON.parse(xhttp.responseText);			
			
			alert(result.message);
			localStorage.removeItem("token");
			loadView(token);
		}
	};
	
	xhttp.send("token="+token);
}

function validateLoginForm() {	
	var email = document.forms["loginForm"]["email"].value;
	var password = document.forms["loginForm"]["password"].value;
	
	// Call Flask function here
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/sign_in", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// Login processed by Flask
			var result = JSON.parse(xhttp.responseText);			
			
			if(result.success == true) {
				localStorage.setItem("token", result.data);
				loadView();
				return true;
			}
			else {
				alert(result.message);
				return false;
			}
		}
	};
	
	xhttp.send("email="+email+"&password="+password);
	
	return false;
}

function validateSignupForm() {
    var password1 = document.forms["signupForm"]["password"].value;
	var password2 = document.forms["signupForm"]["password2"].value;
    
	if(password1 === password2 && password1.length >= 8) { // at least 8 characters long	
		var email = document.forms["signupForm"]["email"].value;
		var password = document.forms["signupForm"]["password"].value;
		var firstname = document.forms["signupForm"]["firstname"].value;
		var familyname = document.forms["signupForm"]["familyname"].value;
		var gender = document.forms["signupForm"]["gender"].value;
		var city = document.forms["signupForm"]["city"].value;
		var country = document.forms["signupForm"]["country"].value;
		
		var data= "email="+email+"&";
		data += "password="+password+"&";
		data += "firstname="+firstname+"&";
		data += "familyname="+familyname+"&";
		data += "gender="+gender+"&";
		data += "city="+city+"&";
		data += "country="+country;

		// Call Flask function here
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "/sign_up", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				// Login processed by Flask
				var result = JSON.parse(xhttp.responseText);
							
				if(result.success) {
					document.getElementById("signupForm").reset();
					return true;
				}
				else {
					alert(result.message);
					return false;
				}
			}
		};
		
		xhttp.send(data);

		return false;
	}
	else
		return false;
}

function browseUser() {
	var email = document.forms["browseUserForm"]["email"].value;
	
	// GET USER DATA
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/get_user_data_by_email", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onreadystatechange = function() {
		
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// Login processed by Flask
			var user = JSON.parse(xhttp.responseText);			
				
			//alert(user.data.email);	
				
			if(user.success) {
				document.getElementById("firstname_b").innerHTML = user.data.firstname;
				document.getElementById("lastname_b").innerHTML = user.data.familyname;
				document.getElementById("email_b").innerHTML = user.data.email;
				document.getElementById("gender_b").innerHTML = user.data.gender;
				document.getElementById("city_b").innerHTML = user.data.city;
				document.getElementById("country_b").innerHTML = user.data.country;
				document.getElementById("userInfo_b").style.display = "block";
				return true;
			}
			else {
				alert(user.message);
				return false;
			}
		}
	};
	
	xhttp.send("email="+email);
	
	// GET USER MESSAGES
	// FLASK HERE
	// Call Flask function here
	var xhttp1 = new XMLHttpRequest();
	xhttp1.open("POST", "/get_user_messages_by_email", true);
	xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhttp1.onreadystatechange = function() {
		if (xhttp1.readyState == 4 && xhttp1.status == 200) {
			// Login processed by Flask
			var result = JSON.parse(xhttp1.responseText);
			var messages = result.data;		
					
			if(result.success) {
				document.getElementById("messageWall_b").innerHTML = "";
	
				for (i = 0; i < messages.length; i++) { 
					document.getElementById("messageWall_b").innerHTML += messages[i][1] + ": ";
					document.getElementById("messageWall_b").innerHTML += messages[i][3] + "<br\><br\>";
				}
				
				return true;
			}
			else {
				alert(result.message);
				return false;
			}
		}
	};
	
	xhttp1.send("email="+email);
	
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
	var email = document.getElementById("email").innerHTML;

	// Call Flask function here
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/post_message", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// Login processed by Flask
			var result = JSON.parse(xhttp.responseText);			
			
			if(result.success == true) {
				
				return true;
			}
			else {
				alert(result.message);
				return false;
			}
		}
	};
	
	var token = localStorage.getItem("token");
	
	xhttp.send("token="+token+"&email="+email+"&message="+message);
	
	return false;

	//var result = serverstub.postMessage(localStorage.getItem("token"), message, email);
}

function showHome()
{
	localStorage.setItem("tab", "home");
	
	document.getElementById("home").style.display = "block";
	document.getElementById("browse").style.display = "none";
	document.getElementById("account").style.display = "none";
	
	// FLASK HERE
	// Call Flask function here
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/get_user_data_by_token", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onreadystatechange = function() {
		
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// Login processed by Flask
			var user = JSON.parse(xhttp.responseText);			
				
			//alert(user.data.email);	
				
			if(user.success) {
				document.getElementById("firstname").innerHTML = user.data.firstname;
				document.getElementById("lastname").innerHTML = user.data.familyname;
				document.getElementById("email").innerHTML = user.data.email;
				document.getElementById("gender").innerHTML = user.data.gender;
				document.getElementById("city").innerHTML = user.data.city;
				document.getElementById("country").innerHTML = user.data.country;
				return true;
			}
			else {
				alert(user.message);
				return false;
			}
		}
	};
	
	var token = localStorage.getItem("token");
	xhttp.send("token="+token);
	
	// FLASK HERE
	// Call Flask function here
	var xhttp1 = new XMLHttpRequest();
	xhttp1.open("POST", "/get_user_messages_by_token", true);
	xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	xhttp1.onreadystatechange = function() {
		if (xhttp1.readyState == 4 && xhttp1.status == 200) {
			// Login processed by Flask
			var result = JSON.parse(xhttp1.responseText);
			var messages = result.data;		
					
			if(result.success) {
				document.getElementById("messageWall").innerHTML = "";
	
				for (i = 0; i < messages.length; i++) { 
					document.getElementById("messageWall").innerHTML += messages[i][1] + ": ";
					document.getElementById("messageWall").innerHTML += messages[i][3] + "<br\><br\>";
				}
				
				return true;
			}
			else {
				alert(result.message);
				return false;
			}
		}
	};
	
	xhttp1.send("token="+token);
	
	//var messages = serverstub.getUserMessagesByToken(localStorage.getItem("token")).data;
	
	return false;
}

function showBrowse()
{
	localStorage.setItem("tab", "browse");
	
	document.getElementById("home").style.display = "none";
	document.getElementById("browse").style.display = "block";
	document.getElementById("account").style.display = "none";	
}

function showAccount()
{
	localStorage.setItem("tab", "account");
	
	document.getElementById("home").style.display = "none";
	document.getElementById("browse").style.display = "none";
	document.getElementById("account").style.display = "block";
}
