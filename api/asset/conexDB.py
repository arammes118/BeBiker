import pymysql
def conexDB(host,user,psw,db=None):
    if db:
         return pymysql.connect(host=host, user= user, passwd=psw, db=db )
    return pymysql.connect(host=host, user= user, passwd=psw)
