import mysql.connector
import csv

# Open database connection
db = mysql.connector.connect(host='localhost', database='mydatabase', user='root', password='')

# prepare a cursor object using cursor() method
cursor = db.cursor()
cursor.execute('TRUNCATE TABLE symbol')
csv_data = csv.reader(open('C:\\Users\\Administrator\\PycharmProjects\\anychart\\symbol.csv'))
# print(csv_data)

'''
i=0
for column in csv_data:
    i=i+1
    a=column[0]
    cursor.execute('insert into symbol values("%s","%s")' % \
             (i,a))
'''
i = 0
for column in csv_data:
    i = i + 1
    if i > 1:
        general_symbol = column[0]
        general_name = column[1]
        isin_code = column[2]
        screener_url = column[3]
        screener_down_symbol = column[4]
        print(general_symbol)
        # Prepare SQL query to INSERT a record into the database.
        sql = "insert into symbol(nse_symbol,general_name,isin_code,screener_url,\
        screener_down_symbol) VALUES ('%s','%s','%s','%s','%s')" % (general_symbol, general_name, \
                                                                   isin_code, screener_url, \
                                                           screener_down_symbol)
        try:
            # Execute the SQL command
            cursor.execute(sql)
            # Commit your changes in the database
            db.commit()
        except:
            # Rollback in case there is any error
            db.rollback()

    print('Succesfully Inserted the values to DB !')
# disconnect from server
db.close()
