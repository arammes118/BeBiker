import time
import jwt

# Importamos request de Flask
from flask import request
from asset.conexDB import conexDB

# Importamos las constantes de los estados de la API
from asset.constantes import *

#Importamos el fichero JSON para hacer la conexión
from asset.json import *

from config import DevelopmentConfig

# Cargamos el diccionario con la configuracion de la BD
config = cargaJSON('../config.json')

def conex():
	return conexDB( 
		host = config['db']['host'], 
		user = config['db']['user'],
		port = config['db']['port'],
		psw = config['db']['psw'], 
		db = config['db']['db'] 
    )

# FUNCION DE PETICIONES A LA BD
def peticion(url, method='GET', json=None):
    Auth = None if 'user' not in config['db'] else (config['db']['user'], config['db']['psw'])
    url = f"http://{config['db']['host']}:{config['db']['port']}{url}"
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

# FUNCION QUE DEVUELVE UN JWT codificado
def getJWT(pay):
    pay['iat'] = round(time.time())
    pay['exp'] = pay['iat'] + config['api']['expToken'] # expiracion del token
    return (jwt.encode(pay, config['api']['secretJWT'], algorithm='HS256'))

# FUNCIÓN AUTENTIFICA EL JWT
def autentificacion():
    token = request.headers.get('authorization')
    # comprobamos que se le pase el token por el header
    if (token == None):
        return ({
            'estado': ERR_TOKEN_REQ,
            'mensaje': (f'Token requerido'),
            'token': ''
        })
    
    try:
        # Decodificamos el token pasado con la claveJWT que la encripta para validar que es correcta
        payload = jwt.decode(token, config['api']['secretJWT'], algorithm='HS256') 

    except jwt.ExpiredSignatureError: # Nuestro token ha expirado
        return ({
            'estado': ERR_TOKEN_EXP,
            'mensaje': (f'Token expirado'),
            'token': ''
        })
    
    except jwt.InvalidTokenError: # El token no es correcto
        return ({
            'estado': ERR_TOKEN_INV,
            'mensaje': (f'Token inválido'),
            'token': ''
        })
    
    res = {
        'estado': EST_OK,
        'mensaje': 'OK'
    }

    if (round(time.time()) - payload['iat'] > config['api']['renToken']): # Hay que renovar el token
        res['token'] = getJWT(payload)
    return (res)