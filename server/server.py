import sqlite3

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
 return 'Hello World! test'
 
@app.route('/bye')
def bye_world():
 return 'Bye World!'

if __name__ == '__main__':
 app.run() 
