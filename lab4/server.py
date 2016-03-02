import sqlite3
import database_helper
import os,binascii # for random token
import json

from flask import Flask, jsonify, request, redirect
from gevent import pywsgi
from gevent.wsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from random import randint

# TODO:
# - make a separate table for email and password (safer)
#

app = Flask(__name__)

socket_list = dict() # {}

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
	
	#print("LOG OUT")
	
	# Check if online
	if database_helper.is_user_online(token) != True:
		return jsonify(success = False, message = "You are not logged in")
	
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

@app.route('/change_password', methods=['POST'])
def change_password():
	token = request.form["token"]
	old_password = request.form["old_password"]
	new_password = request.form["new_password"]
	
	# Check if online
	if database_helper.is_user_online(token) != True:
		return jsonify(success = False, message = "You are not logged in")
	
	# get email from token
	email = database_helper.get_email_from_token(token)
	
	if email is None:
		return jsonify(success = False, message = "Can't find email matching token")
	
	# get and compare current password
	password = database_helper.get_password(email[0])
	if password is None:
		return jsonify(success = False, message = "Can't find password matching email")
	
	if password[0] != old_password:
		return jsonify(success = False, message = "Wrong password entered")
		
	# set new password
	database_helper.set_password(email[0], new_password)
	
	return jsonify(success = True, message = "Password successfully updated")

@app.route('/get_user_data_by_token', methods=['POST'])
def get_user_data_by_token():
	token = request.form["token"]
	email = database_helper.get_email_from_token(token)
	
	if email is None:
		return jsonify(success = False, message = "Can't find email matching token")
		
	user = database_helper.get_user(email[0])
	if user is None:
		return jsonify(success = False, message = "Can't find user data")
	
	u = {}
	u['email'] = user[0]
	u['firstname'] = user[1]
	u['familyname'] = user[2]
	u['country'] = user[3]
	u['city'] = user[4]
	u['gender'] = user[5]
	
	return jsonify(success = True, message = "User data successfully returned", data = u)
		
@app.route('/get_user_data_by_email', methods=['POST'])
def get_user_data_by_email():	
	token = request.form['token']	# token of the user retrieving the data
	email = request.form['email']
		
	# Check if online
	if database_helper.is_user_online(token) != True:
		return jsonify(success = False, message = "You are not logged in")
			
	user = database_helper.get_user(email)
	if user is None:
		return jsonify(success = False, message = "Can't find user data")
	
	u = {}
	u['email'] = user[0]
	u['firstname'] = user[1]
	u['familyname'] = user[2]
	u['country'] = user[3]
	u['city'] = user[4]
	u['gender'] = user[5]
	
	return jsonify(success = True, message = "User data successfully returned", data = u)
		
@app.route('/get_user_messages_by_token', methods=['POST'])
def get_user_messages_by_token():
	token = request.form["token"]
	email = database_helper.get_email_from_token(token)

	if email is None:
		return jsonify(success = False, message = "Can't find email matching token")
		
	messages = database_helper.get_user_messages(email[0])
	return jsonify(success = True, message = "User messages successfully returned", data = messages)
	
		
@app.route('/get_user_messages_by_email', methods=['POST'])
def get_user_messages_by_email():
	token = request.form['token']	# token of the user retrieving the data
	email = request.form["email"]

	# Check if online
	if database_helper.is_user_online(token) != True:
		return jsonify(success = False, message = "You are not logged in")	
	
	messages = database_helper.get_user_messages(email)
	return jsonify(success = True, message = "User messages successfully returned", data = messages)
		
@app.route('/post_message', methods=['POST'])
def post_message():	
	token = request.form['token']		# from
	message = request.form['message']
	email = request.form['email']		# to

	# Check if online
	if database_helper.is_user_online(token) != True:
		return jsonify(success = False, message = "You are not logged in")	
	
	sender = database_helper.get_email_from_token(token)

	database_helper.add_message(sender[0], email, message)
		
	return jsonify(success = True, message = "Message successfully posted")	

@app.route('/websocket')
def websocket():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
		
		# TODO: WebSockets should send in json format
		# id, data etc
		
        while True:
			msg = ws.receive()
			message = json.loads(msg)
			
			if message["id"] == "email":				
				if message["email"] in socket_list:
					socket_list[message["email"]].send(json.dumps(dict(id = "sign_out")))				
				socket_list[message["email"]] = ws
				
			elif message["id"] == "update_chart":
				token = message["token"]
				email = database_helper.get_email_from_token(token)

				# get user statistics
				sent_ = database_helper.get_num_messages_sent(email[0])
				received_ = database_helper.get_num_messages_received(email[0])
				online_ = database_helper.get_num_users_online()
				
				ws.send(json.dumps(dict(id = "update_chart", sent = sent_, received = received_, online = online_)))
				
			#print("Socket email: " + email)
    #return	
	
if __name__ == '__main__':
	app.debug = True
	#app.run() 
 
	http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
	http_server.serve_forever()
