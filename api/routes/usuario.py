# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # USUARIOS  # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Importaciones
from flask import Blueprint # Blueprint sirve para organizar código que esta relacionado
from flask import request 

# Creamos blueprint de usuarios
perfil = Blueprint('perfil', __name__)