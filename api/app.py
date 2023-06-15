# Importamos Flask
import os
from flask import Flask, request, jsonify

# Importamos MySQL de Flask
from flask_mysqldb import MySQL

import base64

#Importamos fichero con funciones de ayuda
from asset.funciones import *
from asset.json import *

# Importamos fichero config
from config import config

# Creamos la aplicación
app = Flask(__name__)

# Cargamos el diccionario de configuración
configApi = cargaJSON("../config.json")
 
# Creamos URL de nuestra aplicacion
URL = f"/{configApi['api']['app']}/{configApi['api']['version']}"

# Creamos variable con la conexión a la BBDD   
conex = MySQL(app)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # LOGIN Y REGISTRO # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

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
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"JSON requerido") })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('mail' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: mail") })
    if ('psw' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: psw") })
    if ('usuario' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: usuario") })
    if ('nombre' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: nombre") })
    if ('apellido' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: apellido") })
    if ('fecha' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: fecha") })
    
    foto_base64 = mJson.get('foto')

    # Decodificar la imagen base64 a bytes
    foto_bytes = base64.b64decode(foto_base64)

    # Obtener el nombre del archivo basado en el idUsuario y la descripción
    nombre_archivo = f"Perfil_{mJson['usuario']}.png"

    # Ruta completa del archivo
    ruta_archivo = os.path.join('perfil', nombre_archivo)

    # Guardar la imagen en un archivo en la carpeta "publicaciones"
    with open(ruta_archivo, 'wb') as file:
        file.write(foto_bytes)

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
        cursor.execute("""INSERT INTO usuarios (mail, psw, usuario, nombre, apellido, fecha, foto) 
                        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}')"""
                       .format(mJson['mail'], mJson['psw'], mJson['usuario'], mJson['nombre'], mJson['apellido'], mJson['fecha'], mJson['foto']))
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

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # PERFILES # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

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
    
    cur.execute(f"""SELECT idUsuario, mail, usuario, nombre, apellido, nPost, nRutas, nSeguidos, nSeguidores, foto
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
            'nSeguidores': res[0][8],
            'foto': ''
        }

        # Obtener el contenido de la imagen y convertirlo a base64
        foto_path = os.path.join('perfil', f'Perfil_{res[0][2]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        usuario['foto'] = foto_base64

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
    
    cur.execute("""SELECT idUsuario, mail, usuario, nombre, apellido, nPost, nRutas, foto
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
            'nRutas': res[0][6],
            'foto': ''
        }

        # Obtener el contenido de la imagen y convertirlo a base64
        foto_path = os.path.join('perfil', f'Perfil_{res[0][2]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        usuario['foto'] = foto_base64

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
    
    cur.execute("""SELECT idPublicacion, descripcion, u.usuario, p.foto, cfUsuario, u.foto
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
            'foto': '',
            'cfUsuario': elem[4],
            'fotoUsuario': elem[5]
        }

        # Obtener el contenido de la imagen y convertirlo a base64
        foto_path = os.path.join('publicaciones', f'{elem[4]}_{elem[1]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        foto_path = os.path.join('perfil', f'Perfil_{elem[2]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64Usuario = base64.b64encode(foto_bytes).decode('utf-8')

        publicacion['foto'] = foto_base64
        publicacion['fotoUsuario'] = foto_base64Usuario
        publicaciones.append(publicacion)

    cur.close()
    return jsonify(publicaciones)

# # # # # # # # END-POINT # # # # # # # #
# RUTA INSERTAR PUBLICACION
@app.route(f"/{URL}/publicaciones/ins", methods=['POST'])
def ins():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"JSON requerido") })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('descripcion' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: descripcion") })

    idUsuario = mJson.get('idUsuario')  # Accede al valor de idUsuario
    foto_base64 = mJson.get('foto')

    # Decodificar la imagen base64 a bytes
    foto_bytes = base64.b64decode(foto_base64)

    # Obtener el nombre del archivo basado en el idUsuario y la descripción
    nombre_archivo = f"{idUsuario}_{mJson['descripcion']}.png"

    # Ruta completa del archivo
    ruta_archivo = os.path.join('publicaciones', nombre_archivo)

    # Guardar la imagen en un archivo en la carpeta "publicaciones"
    with open(ruta_archivo, 'wb') as file:
        file.write(foto_bytes)

    # Creamos un cursor para la consulta
    try:
        cursor = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    # Consulta que nos devuelve el contador de post del usuario
    cursor.execute("SELECT nPost FROM usuarios WHERE idUsuario = %s", [idUsuario])
    res1 = cursor.fetchone()
    nPost = res1[0]
    
    try:
        # Consulta SQL
        cursor.execute("""INSERT INTO publicaciones (descripcion, foto, cfUsuario) 
                VALUES ('{0}', '{1}', '{2}')"""
                .format(mJson['descripcion'], mJson['foto'], idUsuario))
        conex.connection.commit() # Confirma la accion de inserción

        # Incrementar el contador de posts del usuario
        nPost += 1

        # Actualizar el contador en la base de datos
        cursor.execute("UPDATE usuarios SET nPost = %s WHERE idUsuario = %s", (nPost, idUsuario))
        conex.connection.commit()

        return respuesta({ 'estado': EST_OK, 'mensaje': ("OK") })
    except:
        return respuesta({ 'estado': ERR_OTHER, 'mensaje': ("Error al insertar") })

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
    
    cur.execute("""SELECT idPublicacion, descripcion, u.usuario, p.foto, cfUsuario
               FROM publicaciones p
               JOIN usuarios u ON u.idUsuario = cfUsuario
               WHERE cfUsuario = %s;""", (id,))
    res = cur.fetchall()

    publicaciones = []
    for elem in res:
        publicacion = {
            'idPublicacion': elem[0],
            'descripcion': elem[1],
            'usuario': elem[2],
            'foto': '',
            'cfUsuario': elem[4]
        }

        # Obtener el contenido de la imagen y convertirlo a base64
        foto_path = os.path.join('publicaciones', f'{elem[4]}_{elem[1]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        publicacion['foto'] = foto_base64
        publicaciones.append(publicacion)

    cur.close()
    return jsonify(publicaciones)

# # # # # # # # END-POINT # # # # # # # #
# METODO BORRAR PUBLICACION
@app.route(f'/{URL}/publicaciones/del', methods=['POST'])
def borPost():
    mJson = request.json #JSON
    if (mJson==None): # se necesita este argumento para la consulta
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje':(f"JSON requerido") })
        
    if ('id' not in mJson): # se necesita este argumento para la consulta
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje':(f"Argumentos requeridos: id") })
        
    try:
        id = int(mJson['id'])
    except:
        return respuesta({ 'estado': ERR_PARAM_ERR, 'mensaje':(f"Argumentos con formato erróneo: id") })
    
    # Creamos un cursor para la consulta
    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    # Obtenemos el ID del usuario a través de la clave foránea
    cur.execute(f"SELECT cfUsuario FROM publicaciones WHERE idPublicacion = {id}")
    idUsuario = cur.fetchone()[0]

    # Obtener el valor actual de nPost del usuario
    cur.execute(f"SELECT nPost FROM usuarios WHERE idUsuario = {idUsuario}")
    res2 = cur.fetchone()
    nPost = res2[0]
    print(idUsuario)
    print(nPost)
    
    try:
        # Eliminamos la publicación
        cur.execute(f"DELETE FROM publicaciones WHERE idPublicacion = {id}")

        # Decrementamos el contador de posts del usuario
        nPost -= 1

        # Actualizamos el contador de publicaciones del usuario
        cur.execute("UPDATE usuarios SET nPost = %s WHERE idUsuario = %s", (nPost, idUsuario))
        conex.connection.commit()

        cur.close()
        return respuesta({ 'estado': EST_OK, 'mensaje': ("OK") })
    except:
        return respuesta({ 'estado': ERR_OTHER, 'mensaje': ("Error al borrar") })

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # COMENTARIOS # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # END-POINT # # # # # # # #
# RUTA INSERTAR VALORACIÓN
@app.route(f"/{URL}/comentarios/ins", methods=["POST"])
def insComentario():
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"JSON requerido") })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('comentario' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: comentario") })
    if ('idUsuario' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: idUsuario") })    
    if ('idPost' not in mJson):
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje': (f"Datos requeridos: idPost") })

    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': "Problema al conectar a la BD" })

    try: 
        # Insertar la valoración en la base de datos
        cur.execute("""INSERT INTO comentarios (comentario, cfUsuario, cfPost) 
                VALUES (%s, %s, %s)""",
                (mJson['comentario'], mJson['idUsuario'], mJson['idPost']))
        conex.connection.commit()

        return respuesta({ 'estado': EST_OK, 'mensaje': ("OK") })

    except:
            return respuesta({ 'estado': EST_OK, 'mensaje': ("Error al añadir el comentario") })

# # # # # # # # END-POINT # # # # # # # #
# COMENTARIOS PUBLICACION
@app.route(f'/{URL}/comentarios/ver')
def listComentariosPosts():
    if (request.args.get("id")==None): # se necesita este argumento para la consulta
        return respuesta({ 'estado': ERR_PARAM_NEC, 'mensaje':(f"Argumentos requeridos: id") })
    
    id = int(request.args.get("id"))

    try:
        cur = conex.connection.cursor()
    except:
        return respuesta({ 'estado': ERR_NO_CONNECT_BD, 'mensaje': (f"Problema al conectar a la BD") })
    
    cur.execute("""SELECT idComentario, comentario, c.cfUsuario, cfPost, u.usuario, u.foto
               FROM comentarios c
               JOIN usuarios u ON u.idUsuario = cfUsuario
               WHERE cfPost = %s;""", (id, ))
    res = cur.fetchall()

    comentarios = []
    for elem in res:
        comentario = {
            'idComentario': elem[0],
            'comentario': elem[1],
            'cfUsuario': elem[2],
            'cfPost': elem[3],
            'usuario': elem[4],
            'foto': ''
        }

        foto_path = os.path.join('perfil', f'Perfil_{elem[4]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        comentario['foto'] = foto_base64
        comentarios.append(comentario)

    cur.close()
    return jsonify(comentarios)

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
    
    cur.execute("""SELECT idRuta, titulo, descripcion, puntoInicio, puntoFin, u.usuario AS usuario, cfUsuario, u.foto
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
            'cfUsuario': elem[6],
            'foto': ''
        }

        foto_path = os.path.join('perfil', f'Perfil_{elem[5]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        ruta['foto'] = foto_base64

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
    
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # SEGUIMIENTO CUENTAS # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # END-POINT # # # # # # # #
# RUTA VER SEGUIDOS
@app.route(f"/{URL}/seguidos/ver")
def listSeguidos():
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
    
    cur.execute("""SELECT u.idUsuario, u.usuario, u.nombre, u.apellido, u.foto, s.cfCuenta2
                   FROM usuarios u
                   JOIN seguidos s ON u.idUsuario = s.cfCuenta2
                   WHERE s.cfCuenta1 = %s;""", (id,))
    res = cur.fetchall()

    seguidos = []
    for elem in res:
        seguido = {
            'idUsuario': elem[0],
            'usuario': elem[1],
            'nombre': elem[2],
            'apellido': elem[3],
            'foto': '',
        }

        # Obtener el contenido de la imagen y convertirlo a base64
        foto_path = os.path.join('perfil', f'Perfil_{elem[1]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        seguido['foto'] = foto_base64
        seguidos.append(seguido)

    cur.close()
    return jsonify(seguidos)

# # # # # # # # END-POINT # # # # # # # #
# RUTA VER SEGUIDOS
@app.route(f"/{URL}/seguidores/ver")
def listSeguidores():
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
    
    cur.execute("""SELECT u.idUsuario, u.usuario, u.nombre, u.apellido, u.foto, s.cfCuenta1
                   FROM usuarios u
                   JOIN seguidos s ON u.idUsuario = s.cfCuenta1
                   WHERE s.cfCuenta2 = %s;""", (id,))
    res = cur.fetchall()

    seguidos = []
    for elem in res:
        seguido = {
            'idUsuario': elem[0],
            'usuario': elem[1],
            'nombre': elem[2],
            'apellido': elem[3],
            'foto': '',
        }

        # Obtener el contenido de la imagen y convertirlo a base64
        foto_path = os.path.join('perfil', f'Perfil_{elem[1]}.png')
        with open(foto_path, 'rb') as file:
            foto_bytes = file.read()
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')

        seguido['foto'] = foto_base64
        seguidos.append(seguido)

    cur.close()
    return jsonify(seguidos)

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