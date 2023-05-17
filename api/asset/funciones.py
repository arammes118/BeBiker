# Importamos las constantes de los estados de la API
from asset.constantes import *

#Importamos el fichero JSON para hacer la conexión
from asset.json import *

from config import DevelopmentConfig
import requests

# FUNCION DE PETICIONES A LA BD
def peticion(url, method='GET', json=None):
    Auth = None if not hasattr(DevelopmentConfig, 'MYSQL_USER') else (DevelopmentConfig.MYSQL_USER, DevelopmentConfig.MYSQL_PASSWORD)
    url = f"http://{DevelopmentConfig.MYSQL_HOST}:5000{url}"
    headers =	{
			"content-type": "application/json",
			"Accept": "application/json"
		}
    payload ={
		'format':'JSON'
	}
    try:
        if (method=='GET'):
            return(requests.get(url,
					headers=headers,
					params= payload,
					json=json,
					auth=Auth,
					verify=False).json())
    except:
        print("ERROR EN LA PETICION")


# FUNCION DE RESPUESTA HTTP
def respuesta(mensaje):
    if (mensaje['estado'] == EST_OK): # ESTADO TODO BIEN
        estado = 200
    elif (mensaje['estado'] == ERR_NOT_FOUND): # ESTADO DE NO ENCONTRADO
        estado = 404
    else: # RESTO DE ERRORES
        estado = 400
    return mensaje, estado