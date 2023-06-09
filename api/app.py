# Importamos Flask
from flask import Flask, request, jsonify

# Importamos MySQL de Flask
from flask_mysqldb import MySQL

from werkzeug.utils import secure_filename

import os

import smtplib
import random
import string


#Importamos fichero con funciones de ayuda
from asset.funciones import *
from asset.json import *

# Importamos fichero config
from config import config

# Importamos los módulos de las diferentes rutas (Blueprint)
# from routes.publicaciones import publicaciones
# from routes.rutas import rutas
# from routes.usuario import perfil

from io import BytesIO

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
# app.register_blueprint(publicaciones, url_prefix=f"/{URL}/publicaciones") # Ruta publicaciones
# app.register_blueprint(rutas, url_prefix=f"/{URL}/rutas") # Ruta rutas
# app.register_blueprint(perfil, url_prefix=f"/{URL}/perfil") # Ruta perfil

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
            'mensaje': (f'Argumentos requeridos: Auth (mail, auth y psw)')
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
            'jwt': '',
            'res': {
                'auth': False
            }
        }))
    else:
        return (respuesta({
            'estado': EST_OK,
            'mensaje': 'OK',
            'token': getJWT({
                'id':res[0][0]
            }),
            'res': {
                'auth': True,
            }
        }))

# # # # # # # # END-POINT # # # # # # # #
# RUTA REGISTRO USUARIO
@app.route(f'/{URL}/registro', methods=['POST'])
def registro():
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
    if ('apellido' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: apellido")
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
        cursor.execute("""INSERT INTO usuarios (mail, psw, usuario, nombre, apellido, fecha) 
                        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}')"""
                       .format(mJson['mail'], mJson['psw'], mJson['usuario'], mJson['nombre'], mJson['apellido'], mJson['fecha']))
        conex.connection.commit() # Confirma la accion de inserción

        return jsonify({'mensaje': 'OK'})
    except:
        return jsonify({'mensaje': 'NO'})

# # # # # # # # END-POINT # # # # # # # #
# RUTA COMPROBAR MAIL NO REPETIDO
@app.route(f'/{URL}/registro/rep_mail')
def repMail():
    # Verifica si se proporciona el argumento 'mail'
    mail = request.args.get("mail")
    if mail is None:
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': 'Argumentos requeridos: mail'
        })

    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': 'Problema al conectar a la BD'
        })

    cursor.execute("SELECT idUsuario FROM usuarios WHERE mail = %s;", (mail,))
    res = cursor.fetchone()

    if res is None:
        return respuesta({
            'estado': EST_OK,
            'mensaje': 'OK',
            'res': True
        })
    else:
        return respuesta({
            'estado': EST_OK,
            'mensaje': 'OK',
            'res': False
        })

# # # # # # # # END-POINT # # # # # # # #
# RUTA COMPROBAR USUARIO NO REPETIDO
@app.route(f'/{URL}/registro/rep_usuario')
def repUser():
    # Verifica si se proporciona el argumento 'usuario'
    usuario = request.args.get("usuario")
    if usuario is None:
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': 'Argumentos requeridos: usuario'
        })

    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    cursor.execute("SELECT idUsuario FROM usuarios WHERE usuario = %s;", (usuario,))
    res = cursor.fetchone()

    if res is None:
        return respuesta({
            'estado': EST_OK,
            'mensaje': 'OK',
            'res': True
        })
    else:
        return respuesta({
            'estado': EST_OK,
            'mensaje': 'OK',
            'res': False
        })

# # # # # # # # END-POINT # # # # # # # #
# RUTA VER PERFIL POR ID
@app.route(f"{URL}/perfil/ver", methods=["GET"])
def list2():
    result=autentificacion()
    if result["estado"] > 0:
        return (result)
    
    if (request.args.get("id")==None): # se necesita este argumento para la consulta
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje':(f"Argumentos requeridos: id") })
    
    try:
        id = int(request.args.get("id"))
    except:
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Argumentos con formato erróneo: id") })
    
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    cur.execute(f"""SELECT idUsuario, mail, usuario, nombre, apellido, nPost, nRutas, nSeguidos, nSeguidores
                FROM usuarios
                WHERE idUsuario = {id};
                """)
    res = cur.fetchall()

    if len(res) > 0:
        usuario = {
            'idUsuario': res[0][0],
            'mail': res[0][1],
            'usuario': res[0][2],
            'nombre': res[0][3],
            'apellido': res[0][4],
            'nPost': res[0][5],
            'nRutas': res[0][6],
            'nSeguidos': res[0][7],
            'nSeguidores': res[0][8]
        }
    cur.close()
    return jsonify(usuario)

# # # # # # # # END-POINT # # # # # # # #
# RUTA VER PERFIL DE OTRO USUARIO
@app.route(f"{URL}/perfil/<string:usuario>", methods=["GET"])
def list3(usuario):
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    cur.execute("""SELECT idUsuario, mail, usuario, nombre, apellido, nPost, nRutas
                FROM usuarios
                WHERE usuario = %s;
                """, (usuario,))
    res = cur.fetchall()

    if len(res) > 0:
        usuario = {
            'idUsuario': res[0][0],
            'mail': res[0][1],
            'usuario': res[0][2],
            'nombre': res[0][3],
            'apellido': res[0][4],
            'nPost': res[0][5],
            'nRutas': res[0][6]
        }
    cur.close()
    return jsonify(usuario)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # PUBLICACIONES # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # END-POINT # # # # # # # #
# RUTA LISTAR PUBLICACIONES
@app.route(f"{URL}/publicaciones")
def list():
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    cur.execute("""SELECT idPublicacion, descripcion, u.usuario, cfUsuario
                FROM publicaciones p
                JOIN usuarios u ON p.cfUsuario = u.idUsuario
                """)
    res = cur.fetchall()

    publicaciones = []
    for elem in res:
        publicacion = {
            'idPublicacion': elem[0],
            'descripcion': elem[1],
            'usuario': elem[2],
            'cfUsuario': elem[3]
        }

        publicaciones.append(publicacion)
    cur.close()
    return jsonify(publicaciones)

# # # # # # # # END-POINT # # # # # # # #
# RUTA INSERTAR PUBLICACION

app.config["UPLOAD_FOLDER"] = "../client/src/assets/publicaciones"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route(f"/{URL}/publicaciones/ins", methods=['POST'])
def ins():
    if 'image' not in request.files:
        resp = jsonify({
            'status' : False,
            'message' : 'Image is not defined'})
        resp.status_code = 400
        return resp

    files = request.files.getlist('foto')

    errors = {}
    success = False

    for photo in files:

        if photo and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            success = True
        else:
            errors[photo.filename] = 'Image type is not allowed'

    if success and errors:
        errors['message'] = jsonify({
            'data' : photo.filename,
            'status' : True,
            'message' : 'Image(s) successfully uploaded'})
        resp = jsonify(errors)
        resp.status_code = 500
        return resp

    if success:
        resp = jsonify({
            'data' : photo.filename,
            'status' : True,
            'message' : 'Images successfully uploaded'})
        resp.status_code = 201
        return resp
    else:
        resp = jsonify(errors)
        resp.status_code = 500
        return resp
    
# # # # # # # # END-POINT # # # # # # # #
# RUTA VER PUBLICACIONES POR ID
@app.route(f"/{URL}/publicaciones/ver")
def listP():
    if (request.args.get("id")==None): # se necesita este argumento para la consulta
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje':(f"Argumentos requeridos: id") })
    
    try:
        id = int(request.args.get("id"))
    except:
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Argumentos con formato erróneo: id") })
    
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    cur.execute("""SELECT idPublicacion, descripcion, u.usuario, cfUsuario
               FROM publicaciones
               JOIN usuarios u ON u.idUsuario = cfUsuario
               WHERE cfUsuario = %s;""", (id,))
    res = cur.fetchall()

    publicaciones = []
    for elem in res:
        publicacion = {
            'idPublicacion': elem[0],
            'descripcion': elem[1],
            'usuario': elem[2],
            'cfUsuario': elem[3]
        }

        publicaciones.append(publicacion)
    cur.close()
    return jsonify(publicaciones)

# # # # # # # # END-POINT # # # # # # # #
# METODO BORRAR PUBLICACION
@app.route(f'/{URL}/publicaciones/del', methods=['POST'])
def bor2():
    mJson = request.json #JSON
    if (mJson==None): # se necesita este argumento para la consulta
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje':(f"JSON requerido")
        })
        
    if ('id' not in mJson): # se necesita este argumento para la consulta
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje':(f"Argumentos requeridos: id")
        })
        
    try:
        id = int(mJson['id'])
    except:
        return respuesta({
            'estado': ERR_PARAM_ERR,
            'mensaje':(f"Argumentos con formato erróneo: id")
        })
    
    # Creamos un cursor para la consulta
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    # Obtenemos el ID del usuario a través de la clave foránea
    cursor.execute(f"SELECT cfUsuario FROM publicaciones WHERE idPublicacion = {id}")
    res1 = cursor.fetchone()
    idUsuario = res1[0]

    # Obtener el valor actual de nPost del usuario
    cursor.execute(f"SELECT nPost FROM usuarios WHERE idUsuario = {idUsuario}")
    res2 = cursor.fetchone()
    nPost = res2[0]
    print(idUsuario)
    print(nPost)
    
    try:
        # Eliminamos la publicación
        cursor.execute(f"DELETE FROM publicaciones WHERE idPublicacion = {id}")

        # Decrementamos el contador de posts del usuario
        nPost -= 1

        # Actualizamos el contador de publicaciones del usuario
        cursor.execute("UPDATE usuarios SET nPost = %s WHERE idUsuario = %s", (nPost, idUsuario))
        conex.connection.commit()

        cursor.close()
        return jsonify({'mensaje': 'OK'})
    except:
        return jsonify({'mensaje': 'NO'})


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # RUTAS # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # END-POINT # # # # # # # #
# RUTA LISTAR RUTAS
@app.route(f"/{URL}/rutas")
def listRutas():
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    cur.execute("""SELECT idRuta, titulo, descripcion, puntoInicio, puntoFin, u.usuario AS usuario, cfUsuario
                FROM rutas r
                JOIN usuarios u ON r.cfUsuario = u.idUsuario
                """)
    res = cur.fetchall()

    rutas = []
    for elem in res:
        ruta = {
            'idRuta': elem[0],
            'titulo': elem[1],
            'descripcion': elem[2],
            'puntoInicio': elem[3],
            'puntoFin': elem[4],
            'usuario': elem[5],
            'cfUsuario': elem[6]
        }

        rutas.append(ruta)
    cur.close()
    return jsonify(rutas)

# # # # # # # # END-POINT # # # # # # # #
# RUTA MOSTRAR RUTAS
@app.route(f"/{URL}/ruta/<string:titulo>/<string:usuario>")
def listRuta(titulo, usuario):
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': "Problema al conectar a la BD"
        })

    cur.execute("""SELECT idRuta, titulo, descripcion, puntoInicio, puntoFin, u.usuario AS usuario, cfUsuario
                FROM rutas r
                JOIN usuarios u ON r.cfUsuario = u.idUsuario
                WHERE titulo = %s AND usuario = %s;
                """, (titulo, usuario,))
    res = cur.fetchone()  # Obtener solo un resultado

    if res:
        ruta = {
            'idRuta': res[0],
            'titulo': res[1],
            'descripcion': res[2],
            'puntoInicio': res[3],
            'puntoFin': res[4],
            'usuario': res[5],
            'cfUsuario': res[6]
        }
        cur.close()
        return jsonify(ruta)
    else:
        cur.close()
        return respuesta({
            'estado': ERR_OTHER,
            'mensaje': "No se encontró la ruta"
        })

# # # # # # # # END-POINT # # # # # # # #
# RUTA INSERTAR RUTA
@app.route(f"/{URL}/rutas/ins", methods=['POST'])
def insRuta():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"JSON requerido")
        })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('titulo' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: titulo") })
    if ('descripcion' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: descripcion") })
    if ('puntoInicio' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: puntoInicio") })
    if ('puntoFin' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: puntoFin") })
    
    idUsuario = mJson.get('idUsuario')  # Accede al valor de idUsuario

    # Creamos un cursor para la consulta
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    # Consulta que nos devuelve el contador de rutas del usuario
    cursor.execute("SELECT nRutas FROM usuarios WHERE idUsuario = %s", [idUsuario])
    res1 = cursor.fetchone()
    if res1 is not None:
        nRutas = res1[0]
    else:
        nRutas = 0  # Asignar 0 como valor predeterminado
    
    try:
        # Consulta SQL
        cursor.execute("""INSERT INTO rutas (titulo, descripcion, puntoInicio, puntoFin, cfUsuario) 
                VALUES ('{0}', '{1}', '{2}', '{3}', '{4}')"""
                .format(mJson['titulo'], mJson['descripcion'], mJson['puntoInicio'], mJson['puntoFin'], idUsuario))
        conex.connection.commit() # Confirma la accion de inserción

        # Incrementar el contador de rutas del usuario
        nRutas += 1

        # Actualizar el contador en la base de datos
        cursor.execute("UPDATE usuarios SET nRutas = %s WHERE idUsuario = %s", (nRutas, idUsuario))
        conex.connection.commit()

        return respuesta({ 'estado': EST_OK, 'mensaje': ("OK") })
    except:
        return respuesta({ 'estado': ERR_OTHER, 'mensaje': ("Error al insertar") })

# # # # # # # # END-POINT # # # # # # # #
# RUTA INSERTAR VALORACIÓN
@app.route(f"/{URL}/ruta/insval", methods=["POST"])
def insVal():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"JSON requerido")
        })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('comentario' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: comentario") })
    if ('puntuacion' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: puntuacion") })
    if ('idUsuario' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: idUsuario") })    
    if ('userId' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: userId") })
    if ('ruta' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: ruta") })
    
    idUsuario = mJson['idUsuario']
    userId = mJson['userId']
    ruta = mJson['ruta']

    print(mJson['puntuacion'])

    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': "Problema al conectar a la BD"
        })
    
    print(mJson)

    cur.execute("SELECT idUsuario FROM usuarios WHERE usuario = %s", (userId, ))
    usuario = cur.fetchone()[0]
    
    # Obtener el id de la ruta
    cur.execute("SELECT idRuta FROM rutas WHERE titulo = %s AND cfUsuario = %s", (ruta, usuario))
    idRuta = cur.fetchone()[0]

    print(idRuta)

    try: 
        # Insertar la valoración en la base de datos
        cur.execute("""INSERT INTO valoraciones (comentario, valoracion, cfRuta, cfUsuario) 
                VALUES (%s, %s, %s, %s)""",
                (mJson['comentario'], mJson['puntuacion'], idRuta, idUsuario))
        conex.connection.commit()

        return respuesta({ 'estado': EST_OK, 'mensaje': ("OK") })

    except:
            return respuesta({ 'estado': EST_OK, 'mensaje': ("Error al registrar") })

# # # # # # # # END-POINT # # # # # # # #
# RUTA VER COMENTARIOS
@app.route(f"/{URL}/ruta/comments")
def listComments():
    if (request.args.get("ruta")==None): # se necesita este argumento para la consulta
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje':(f"Argumentos requeridos: ruta") })
    
    ruta = request.args.get("ruta")

    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    cur.execute("SELECT idRuta FROM rutas WHERE titulo = %s;", (ruta, ))
    cfRuta = cur.fetchone()[0]
    
    cur.execute("""SELECT idValoracion, valoracion, comentario, cfRuta, v.cfUsuario
               FROM valoraciones v
               JOIN rutas r ON r.idRuta = cfRuta
               WHERE cfRuta = %s;""", (cfRuta, ))
    res = cur.fetchall()

    comentarios = []
    for elem in res:
        cfUsuario = elem[4]
        cur.execute("SELECT usuario FROM usuarios WHERE idUsuario=%s", (cfUsuario, ))
        usuario = cur.fetchone()[0]

        comentario = {
            'idValoracion': elem[0],
            'valoracion': elem[1],
            'comentario': elem[2],
            'cfRuta': elem[3],
            'cfUsuario': cfUsuario,
            'usuario': usuario
        }

        comentarios.append(comentario)

    cur.close()
    return jsonify(comentarios)
    


# # # # # # # # END-POINT # # # # # # # #
# RUTA SEGUIR CUENTAS
@app.route(f"/{URL}/seguir", methods=["POST"])
def seguir():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"JSON requerido") })
    
    cfCuenta1 = mJson.get('cfCuenta1')
    cfCuenta2 = mJson.get('cfCuenta2')

    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': "Problema al conectar a la BD" })
    
    # Obtenemos el id del usuario al que vamos a seugir
    cur.execute('SELECT idUsuario FROM usuarios WHERE usuario = %s', (cfCuenta2, ))
    idCuenta2 = cur.fetchone()[0]

    try:
        # Consulta que nos devuelve el contador de seguidos del usuario
        cur.execute("SELECT nSeguidos, nSeguidores FROM usuarios WHERE idUsuario = %s", (cfCuenta1, ))
        res1 = cur.fetchone()
        if res1 is not None:
            nSeguidos = res1[0]
            nSeguidores = res1[1]
        else:
            nSeguidos = 0  # Asignamos 0 como valor predeterminado
            nSeguidores = 0 # Asignamos 0 como valor predeterminado

        # Verificamos si ya existe una relación de seguimiento entre los usuarios
        cur.execute('SELECT * FROM seguidos WHERE cfCuenta1 = %s AND cfCuenta2 = %s', (cfCuenta1, idCuenta2))
        existe_seguimiento = cur.fetchone() is not None

        if existe_seguimiento:
            # Si ya se siguen, eliminamos el seguimiento
            cur.execute('DELETE FROM seguidos WHERE cfCuenta1 = %s AND cfCuenta2 = %s', (cfCuenta1, idCuenta2))
            if nSeguidos > 0:
                nSeguidos -= 1
            if nSeguidores > 0:
                nSeguidores -= 1
            cur.execute('UPDATE usuarios SET nSeguidos = %s WHERE idUsuario = %s', (nSeguidos, cfCuenta1))
            cur.execute('UPDATE usuarios SET nSeguidores = %s WHERE idUsuario = %s', (nSeguidores, idCuenta2))
            conex.connection.commit()

            mensaje_respuesta = 'Dejaste de seguir al usuario'

        else:
            # Si no se siguen aun, creamos el seguimiento
            cur.execute('INSERT INTO seguidos (cfCuenta1, cfCuenta2) VALUES (%s, %s)', (cfCuenta1, idCuenta2))
            nSeguidos += 1
            nSeguidores += 1
            cur.execute('UPDATE usuarios SET nSeguidos = %s WHERE idUsuario = %s', (nSeguidos, cfCuenta1))
            cur.execute('UPDATE usuarios SET nSeguidores = %s WHERE idUsuario = %s', (nSeguidores, idCuenta2))
            conex.connection.commit()

            mensaje_respuesta = 'Has seguido al usuario'

        return respuesta({ 'estado': EST_OK, 'mensaje': mensaje_respuesta })
    except:
        return respuesta({ 'estado': ERR_OTHER, 'mensaje': 'ERROR al seguir' })

@app.route(f"/{URL}/seguido")
def compSeguido():
    cfCuenta1 = request.args.get('cfCuenta1')
    cfCuenta2 = request.args.get('cfCuenta2')

    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': "Problema al conectar a la BD"
        })
    
    cur.execute('SELECT idUsuario FROM usuarios WHERE usuario = %s',(cfCuenta2, )) 
    idCuenta2 = cur.fetchone()[0]


    cur.execute('SELECT * FROM seguidos WHERE cfCuenta1 = %s AND cfCuenta2 = %s', (cfCuenta1, idCuenta2))
    resultado = cur.fetchone()
    if resultado:
        siguiendo = True
    else:
        siguiendo = False

    return respuesta({
        'estado': EST_OK,
        'mensaje': "Estado siguiendo obtenido correctamente",
        'siguiendo': siguiendo
    })


# # # # # FUNCIÓN PAG NO ENCONTRADA # # # # #
def paginaNoEncontrada(error):
    return "<h1>La página que intentas buscar no existe</h1>"

# # # # # # # # CONTROL DE CORS # # # # # # # 
@app.after_request
def after_request(response): 
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, authorization, mail, psw"
    response.headers["Access-Control-Expose-Headers"] = "Content-Type"
    return response

if __name__ == '__main__':
    app.config.from_object(config['development']) # Cargamos la configuración de nuestra BBDD en la app
    app.register_error_handler(404, paginaNoEncontrada) # Controlamos el error de página no encontrada
    app.run() # Lanzamos la api