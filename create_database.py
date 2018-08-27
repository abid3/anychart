import mysql.connector

# Open database connection
db = mysql.connector.connect(host='localhost', user='root', password='')

# prepare a cursor object using cursor() method
mycursor = db.cursor()
print("Connection Successfully")

mycursor.execute("CREATE DATABASE mydatabase")

print("Create Database Successfully")

# disconnect from server
db.close()
