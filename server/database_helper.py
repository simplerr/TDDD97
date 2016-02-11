import sqlite3
from flask import g
from server import app

def connect_db():
	return sqlite3.connect("database.db")
	
def close():
	get_db().close()

def get_db():
	db = getattr(g, '_database', None)
	if db is None:
		db = g._database = connect_db()
	return db	
	
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# from http://flask.pocoo.org/docs/0.10/patterns/sqlite3/
def query_db(query, args=(), one=False):
        cur = get_db().execute(query, args)
        rv = cur.fetchall()
        cur.close()
        get_db().commit()
        return (rv[0] if rv else None) if one else rv
	
def add_user(email, firstname, familyname, country, city, gender, password):
        return query_db("INSERT INTO Users(email, firstname, familyname, country, city, gender, password) VALUES(?,?,?,?,?,?,?)", [email, firstname, familyname, country, city, gender, password])
       

def add_message(sender, receiver, message):
	return query_db("INSERT INTO Messages(sender,receiver, message) VALUES (?,?,?)", [sender, receiver, message])
	
def get_users():
        return query_db("SELECT * FROM Users")

def get_user_messages(email):
        return query_db("SELECT * FROM Messages WHERE receiver=?", [email])

def get_user_data(email):
        return query_db("SELECT * FROM Users WHERE email=?", [email])

def set_password(email, password):
        return query_db("UPDATE Users SET password=? WHERE email=?", [password, email])

def valid_password(email, password):
        result = query_db("SELECT * FROM Users WHERE email=? AND password=?", [email, password], one=True)
        
        if result is None:
                return False
        else:
                return True
        
