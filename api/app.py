# Importamos Flask
from flask import Flask

# Importamos fichero config de la bd
from config import config

app = Flask(__name__)

@app.route('/')
def index():
    return 'hola mundo'
 
if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.run()