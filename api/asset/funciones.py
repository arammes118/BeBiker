# Importamos las constantes de los estados de la API
from asset.constantes import *

#Importamos el fichero JSON para hacer la conexión
from asset.json import *

from config import DevelopmentConfig

# Cargamos el diccionario con la configuracion de la BD
config = cargaJSON('../config.json')

# FUNCION DE PETICIONES A LA BD
def peticion(url, method='GET', json=None):
    Auth = None if 'user' not in config['db'] else (config['db']['user'], config['db']['psw'])
    url = f"http://{DevelopmentConfig.MYSQL_HOST}:{DevelopmentConfig.MYSQL_PORT}{url}"
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
        elif (method=='POST'):
            return(requests.post(url,
					headers=headers,
					params= payload,
					json=json,
					auth=Auth,
					verify=False).json())
        elif (method=='DELETE'):
            return(requests.delete(url,
					headers=headers,
					params= payload,
					json=json,
					auth=Auth,
					verify=False).json())
    except:
        return (None)


# FUNCION DE RESPUESTA HTTP
def respuesta(mensaje):
    if (mensaje['estado'] == EST_OK): # ESTADO TODO BIEN
        estado = 200
    elif (mensaje['estado'] == ERR_NOT_FOUND): # ESTADO DE NO ENCONTRADO
        estado = 404
    else: # RESTO DE ERRORES
        estado = 400
    return mensaje, estado