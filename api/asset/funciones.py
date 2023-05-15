# IMPORTAMOS LAS CONSTANTES DE ESTADOS DE LA API
from asset.constantes import *
from config import DevelopmentConfig


# CONEXION CON LA BD
def conex():
    return conex(
    user = DevelopmentConfig.MYSQL_USER,
    password = DevelopmentConfig.MYSQL_PASSWORD,
    host = DevelopmentConfig.MYSQL_HOST,
    database = DevelopmentConfig.MYSQL_DB
    )

# FUNCION DE RESPUESTA HTTP
def respuesta(mensaje):
    if (mensaje['estado'] == EST_OK): # ESTADO TODO BIEN
        estado = 200
    elif (mensaje['estado'] == ERR_NOT_FOUND): # ESTADO DE NO ENCONTRADO
        estado = 404
    else: # RESTO DE ERRORES
        estado = 400
    return mensaje, estado


# FUNCION DE PETICIONES A LA BD
def peticion(url,method='GET',json=None):
	url = f"http://{DevelopmentConfig.MYSQL_HOST}:<puerto>{url}"
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
					verify=False).json())
	except:
		return (None)
