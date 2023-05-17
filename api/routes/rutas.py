# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # RUTAS # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Importaciones
from flask import Blueprint # Blueprint sirve para organizar código que esta relacionado
from flask import request 

# Creamos blueprint de rutas
rutas = Blueprint('rutas', __name__)