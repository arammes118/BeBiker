# IMPORTAMOS LAS CONSTANTES DE ESTADOS DE LA API
from asset.constantes import *

# FUNCION DE RESPUESTA HTTP
def respuesta(mensaje):
    if (mensaje['estado'] == EST_OK): # ESTADO TODO BIEN
        estado = 200
    elif (mensaje['estado'] == ERR_NOT_FOUND): # ESTADO DE NO ENCONTRADO
        estado = 404
    else: # RESTO DE ERRORES
        estado = 400
    return mensaje, estado