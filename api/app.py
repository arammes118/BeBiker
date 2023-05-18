# Importamos Flask
from flask import Flask, request, jsonify

# Importamos MySQL de Flask
from flask_mysqldb import MySQL

#Importamos fichero con funciones de ayuda
from asset.funciones import *
from asset.json import *

# Importamos fichero config
from config import config

# Importamos los módulos de las diferentes rutas (Blueprint)
from routes.publicaciones import publicaciones
from routes.rutas import rutas
from routes.usuario import perfil

# Creamos la aplicación
app = Flask(__name__)

# Cargamos el diccionario de configuración
configApi = cargaJSON("../config.json")
 
# Creamos URL de nuestra aplicacion
URL = f"/{configApi['api']['app']}/{configApi['api']['version']}"

# Creamos variable con la conexión a la BBDD   
conex = MySQL(app)

#####################################################################
#### DIFERENTES ENDPOINT SEPARADOS POR RUTAS
#####################################################################
app.register_blueprint(publicaciones, url_prefix=f"/{URL}/publicaciones") # Ruta publicaciones
app.register_blueprint(rutas, url_prefix=f"/{URL}/rutas") # Ruta rutas
app.register_blueprint(perfil, url_prefix=f"/{URL}/perfil") # Ruta perfil

# # # # # # # # END-POINT # # # # # # # #
# LOGIN USUARIOS
@app.route(f'/{URL}/login')
def login():
    mail = request.headers.get('mail')
    psw = request.headers.get('psw')

    # Comporbamos que se pasan estos argumentos para loguear
    if (mail == None or psw == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f'Argumentos requeridos: Auth (mail y psw)')
        })
    
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f'Problema al conectar a la BD')
            
        })
    
    # Consultamos el usuario
    sql = """SELECT idUsuario
             FROM usuarios
             WHERE mail = %s AND psw = %s;"""
    values = (mail, psw)
    cursor.execute(sql, values) # Ejecutamos la consulta
    res = cursor.fetchall() # Guardamos los resultados
    cursor.close()
    
    if len(res) == 0:
        return (respuesta({
            'estado': EST_OK,
            'mensaje': 'NO OK',
            'res': {
                'auth': False
            }
        }))
    else:
        return (respuesta({
            'estado': EST_OK,
            'mensaje': 'OK',
            'res': {
                'auth': True,
            }
        }))

# # # # # # # # END-POINT # # # # # # # #
# RUTA REGISTRO USUARIO
@app.route(f'/{URL}/registro', methods=['POST'])
def registrarUsuario():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"JSON requerido")
        })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('mail' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: mail")
        })
    if ('psw' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: psw")
        })
    if ('usuario' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: usuario")
        })
    if ('nombre' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: nombre")
        })
    if ('fecha' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: fecha")
        })
    
   # Creamos un cursor para la consulta
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f'Problema al conectar a la BD')
        })
    
    try:
        # Consulta SQL
        cursor.execute("""INSERT INTO usuarios (mail, psw, usuario, nombre, fecha) 
                        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}')"""
                       .format(mJson['mail'], mJson['psw'], mJson['usuario'], mJson['nombre'], mJson['fecha']))
        conex.connection.commit() # Confirma la accion de inserción

        return jsonify({'mensaje': 'OK'})
    except:
        return jsonify({'mensaje': 'NO'})
    
# # # # # # # # END-POINT # # # # # # # #
# RUTA LISTAR PRODUCTOS
@app.route(f'/{URL}/productos', methods=['GET'])
def listarProductos():
    try:
        cursor = conex.connection.cursor()# Creamos un cursor para la consulta
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    sql = "SELECT idProducto, nombre, precio, descripcion FROM productos" # Consulta SQL
    cursor.execute(sql) # Ejecutamos la consulta SQL
    datos = cursor.fetchall() # Convierte los resultados y los guarda

    # Lista que almacena los produsctos
    productos = []
    for fila in datos:
        producto = {
            'idProducto': fila[0],
            'nombre': fila[1],
            'precio': fila[2],
            'descripcion': fila[3]
        }
        productos.append(producto)
    return jsonify(productos)

# # # # # # # # END-POINT # # # # # # # #
# RUTA CREAR PRODUCTOS
@app.route('/productos/ins', methods=['POST'])
def insertarProducto():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"JSON requerido")
        })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('nombre' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: nombre")
        })
    if ('precio' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: precio")
        })
    if ('descripcion' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: descripcion")
        })

    # Creamos un cursor para la consulta
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    try:
        # Consulta SQL
        cursor.execute("""INSERT INTO productos (nombre, precio, descripcion) 
                VALUES ('{0}', '{1}', '{2}')"""
                .format(mJson['nombre'], mJson['precio'], mJson['descripcion']))
        conex.connection.commit() # Confirma la accion de inserción

        return respuesta({
            'estado': EST_OK,
            'mensaje': ("OK")
        })
    except:
        return respuesta({
            'estado': ERR_OTHER,
            'mensaje': ("Error al registrar")
        })

# # # # # # # # END-POINT # # # # # # # #
# RUTA BORRAR PRODUCTOS
@app.route('/productos/del', methods=['POST'])
def bor():
     # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"JSON requerido")
        })

    if ('id' not in mJson): # se necesita este dato para la consulta
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje':(f"Datos requeridos: id")
        })
    
    try:
        id = int(mJson['id'])
    except:
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje':(f"Datos erróneos: id")
        })
    
    # Creamos un cursor para la consulta
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    try:
        cursor.execute(f"DELETE FROM productos WHERE idProducto = {id}")
        cursor.close()
        return jsonify({'mensaje': 'OK'})
    except:
        return jsonify({'mensaje': 'NO'})

# # # # # FUNCIÓN PAG NO ENCONTRADA # # # # #
def paginaNoEncontrada(error):
    return "<h1>La página que intentas buscar no existe</h1>"

"""
Control de CORS.() Ahora mismo acepta todo
"""
@app.after_request
def after_request(response): 
    response.headers["Access-Control-Allow-Origin"] = "*" # Cambiar cuando sepamos el dominio final
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, authorization, mail, psw"
    return response

if __name__ == '__main__':
    # print("API en el puerto %s"%(config['api']['port']))
    app.config.from_object(config['development']) # Cargamos la configuración de nuestra BBDD en la app
    app.register_error_handler(404, paginaNoEncontrada) # Controlamos el error de página no encontrada
    app.run() # Lanzamos la api