# Importamos Flask
from flask import Flask, request, jsonify
# Importamos MySQL de Flask
from flask_mysqldb import MySQL

#Importamos fichero con funciones de ayuda
from asset.funciones import *

# Importamos fichero config de la bd
from config import config

app = Flask(__name__)

# Creamos variable con la conexión a la BBDD   
conex = MySQL(app)

# # # # # # # # END-POINT # # # # # # # #
# LOGIN USUARIOS
@app.route('/login')
def login():
    mail = request.headers.get('mail')
    psw = request.headers.get('psw')

    # Comporbamos que se pasan estos argumentos para loguear
    if (mail == None or psw == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f'Argumentos requeridos: mail, psw')
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
             WHERE mail = %s AND psw = %s;""", (mail, psw)
    cursor.execute(sql) # Ejecutamos la consulta
    res = cursor.fetchall() # Guardamos los resultados
    cursor.close() # Cerramos la conexión

    if len(res) == 0:
        return respuesta({
            'estado': EST_OK,
            'mensaje': 'NO OK'
        })
    else:
        return respuesta({
            'estado': EST_OK,
            'mensaje': 'OK'
        })

# # # # # # # # END-POINT # # # # # # # #
# RUTA LISTAR PRODUCTOS
@app.route('/productos', methods=['GET'])
def listarProductos():
    try:
        cursor = conex.connection.cursor() # Creamos un cursor para la consulta
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

        return jsonify({'mensaje': 'OK'})
    except:
        return jsonify({'mensaje': 'NO'})


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

if __name__ == '__main__':
    app.config.from_object(config['development']) # Cargamos la configuración de nuestra BBDD en la app
    app.register_error_handler(404, paginaNoEncontrada) # Controlamos el error de página no encontrada
    app.run() # Lanzamos la api