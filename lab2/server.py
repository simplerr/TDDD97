import sqlite3
import database_helper
import os,binascii # for random token

from flask import Flask, jsonify, request, redirect

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return redirect('static/client.html')
 
@app.route('/init_db')
def init_db():
	database_helper.init_db()
	return 'init_db()'

@app.route('/sign_in', methods=['POST'])
def sign_in():
	email = request.form["email"]
	password = request.form["password"]
	if database_helper.valid_login(email, password):
		token = binascii.b2a_hex(os.urandom(15))
		
		# add to UsersOnline
		database_helper.add_user_online(email, token)
		
		return jsonify(success = True, message = "Login success", data = token)
	else:
		return jsonify(success = False, message = "Login failed")

@app.route('/sign_out', methods=['POST'])
def sign_out():
	token = request.form["token"]
	
	if database_helper.logout_user(token) is None:
		return jsonify(success = True, message = "User successfully logged out")
	else:
		return jsonify(success = False, message = "User not logged in")

@app.route('/sign_up', methods=['POST'])
def sign_up():
	email = request.form['email']
	firstname = request.form['firstname']
	familyname = request.form['familyname']
	gender = request.form['gender']
	city = request.form['city']
	country = request.form['country']
	password = request.form['password']
	
	# does the user already exist?
	if database_helper.get_user(email) is None:
		result = database_helper.add_user(email, firstname, familyname, country, city, gender, password)
		return jsonify(success = True, message = "User successfully added")
	else:
		return jsonify(success = False, message = "A user with the same email already exists")


		
@app.route('/test_post')
def test_post():
	result = requests.post("/sign_in", data = {"email":"axel.blackert@gmail.com", "password":"pwd12"})

	return result.text


###################################

@app.route('/add_message')
def add_message():
	database_helper.add_message("Axel", "axel.blackert@gmail.com", "Test message")
	return 'add_message()'

@app.route('/add_user')
def add_user():
	database_helper.add_user("__1__axel.blackert@gmail.com", "Axel", "Blackert", "Sweden", "Lkpg", "Man", "pwd12")
	return 'add_user()'

@app.route('/get_users')
def get_users():
	return jsonify(data = database_helper.get_users())

@app.route('/get_user_messages')
def get_user_message() :
	return jsonify(data = database_helper.get_user_messages("axel.blackert@gmail.com"))

@app.route('/get_user')
def get_user() :
	return jsonify(data = database_helper.get_user_data("axel.blackert@gmail.com"))

@app.route('/set_password')
def set_password() :
	return jsonify(data = database_helper.set_password("axel.blackert@gmail.com", "nya pwd123"))

@app.route('/valid_password')
def valid_login() :
	return jsonify(data = database_helper.valid_password("axel.blackert@gmail.com", "nya pwd123"))

if __name__ == '__main__':
 app.debug = True
 app.run() 