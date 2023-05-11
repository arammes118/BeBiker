class DevelopmentConfig():
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'stallman'
    MYSQL_DB = 'BeBiker'

config = {
    'development' : DevelopmentConfig
}