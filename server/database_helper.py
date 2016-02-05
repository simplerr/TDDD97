import sqlite3
from flask import g


def connect_db():
	return sqlite3.connect("database.db")
	
def get_db():
	db = getattr(g, 'db', None)
	if db is None:
		db = g.db = connect_db()
	return db
	
def init():
	db = get_db()
	db.execute("drop table if exists entries")
	db.execute("create table entries (id integer primary key, name text,message text)")
	db.commit()
	
def add_message(name,message):
	db = get_db()
	db.execute("insert into entries (name,message) values (?,?)", (name,message))
	db.commit()
	
def close():
	get_db().close()