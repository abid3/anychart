import mysql.connector

# Open database connection
db = mysql.connector.connect(host='localhost', user='root', password='',database="mydatabase")

# prepare a cursor object using cursor() method
mycursor = db.cursor()
print("Connection Successfully")

sql = "CREATE TABLE symbol (id int NOT NULL AUTO_INCREMENT,nse_symbol varchar(30) ,general_name varchar(50),isin_code varchar(7) NOT NULL, screener_url varchar(70) NOT NULL,  screener_down_symbol varchar(7) NOT NULL,PRIMARY KEY (id))"
mycursor.execute(sql)
print("Create Table Successfully")

# disconnect from server
db.close()
