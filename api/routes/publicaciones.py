# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # PUBLICACIONES # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Importaciones
from flask import Blueprint # Blueprint sirve para organizar código que esta relacionado
from flask import request

# Importamos funciones de ayuda
from asset.funciones import * 

# Creamos blueprint de publicaciones
publicaciones = Blueprint('publicaciones', __name__)

# # # # # # # # # # END-POINT # # # # # # # # # #
# Nuevo registro
@publicaciones.route('/ins', methods=['POST'])
def ins():
    result=autentificacion()
    if result["estado"] > 0:
        return (result)
    # JSON con los datos
    mJson = request.json
    if (mJson == None):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"JSON requerido")
        })
    
    # Comprobamos que se le pasan los datos necesarios en el JSON
    if ('descripcion' not in mJson):
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos requeridos: descripcion")
        })
    if ('idUsuario' not in mJson):# se necesita este argumento para la consulta
        return respuesta({
            'estado':ERR_PARAM_NEC,
            'mensaje':(f"Datos requeridos: idUsuario")
        })

    try:
        idUsuario = int(mJson['idUsuario'])
    except:
        return respuesta({
            'estado': ERR_PARAM_NEC,
            'mensaje': (f"Datos con formato erróneo: idUsuario")
        })

    # Creamos un cursor para la consulta
    try:
        con = conex()
        cur = con.cursor()
    except:
        return respuesta({
            'estado': ERR_NO_CONNECT_BD,
            'mensaje': (f"Problema al conectar a la BD")
        })
    
    # Consulta SQL
    cur.execute(f"""INSERT INTO publicaciones (descripcion, cfUsuario) 
                VALUES (%s,{idUsuario})""",
                (mJson['descripcion']))
    res = cur.fetchone() # Confirma la accion de inserción
    con.close()
    if (len(res) != 1):
        return respuesta({
            'estado': ERR_OTHER,
            'mensaje': ("Error al insertar")
        })
    
    result['res'] = {
        'id': res[0]
    }

    return respuesta({result})
