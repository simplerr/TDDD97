import sqlite3
import database_helper

from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
 return 'Hello World!'
 
@app.route('/init_db')
def bye_world():
 database_helper.init_db()
 return 'init_db()'

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

@app.route('/get_user_data')
def get_user_data() :
 return jsonify(data = database_helper.get_user_data("axel.blackert@gmail.com"))

@app.route('/set_password')
def set_password() :
 return jsonify(data = database_helper.set_password("axel.blackert@gmail.com", "nya pwd123"))

@app.route('/valid_password')
def valid_password() :
 return jsonify(data = database_helper.valid_password("axel.blackert@gmail.com", "nya pwd123"))



if __name__ == '__main__':
 app.debug = True
 app.run() 
