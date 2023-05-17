# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # PUBLICACIONES # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Importaciones
from flask import Blueprint # Blueprint sirve para organizar código que esta relacionado
from flask import request 

# Creamos blueprint de publicaciones
publicaciones = Blueprint('publicaciones', __name__)