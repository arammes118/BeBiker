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
# Listado de publicaciones
#@publicaciones.route(f"/")
#def lis():
#    result = autentificacion()
#    if result['estado'] > 0:
#        return (result)
#    # Argumentos necesarios para listar
#    if (request.args.get("ini") == None):
#        return respuesta({
#            'estado': ERR_PARAM_NEC,
#            'mensaje': (f"Argumentos requeridos: ini")
#        })
#    
#    try:
#        ini = int(request.args.get("ini"))
#    except:
#        return respuesta({
#            'estado': ERR_PARAM_NEC,
#            'mensaje': (f'Argumentos con formato erróneo: ini')
#        })
#    
#    try:
#        con = conex()
#        cur = con.cursor()
#    except:
#        return respuesta({
#            'estado': ERR_NO_CONNECT_BD,
#            'mensaje': (f"Problema al conectar a la BD")
#        })
#    
#    cur.execute("""SELECT idPublicacion, descripcion
#                FROM publicacion p
#                OFFSET {ini}
#                """.format(ini=ini))
#    res = cur.fetchall()
#
#    result['res'] = []
#    for elem in res:
#        result['res'].append({
#            'idPublicacion': elem[0],
#            'descripcion':elem[1]
#        })
#    con.close()
#    return respuesta(result)

# # # # # # # # # # END-POINT # # # # # # # # # #
# Nuevo registro
# @publicaciones.route('/ins', methods=['POST'])
# def ins():
#     #result=autentificacion()
#     #if result["estado"] > 0:
#     #    return (result)
#     # JSON con los datos
#     mJson = request.json
#     if (mJson == None):
#         return respuesta({
#             'estado': ERR_PARAM_NEC,
#             'mensaje': (f"JSON requerido")
#         })
#     
#     # Comprobamos que se le pasan los datos necesarios en el JSON
#     if ('descripcion' not in mJson):
#         return respuesta({
#             'estado': ERR_PARAM_NEC,
#             'mensaje': (f"Datos requeridos: descripcion")
#         })
#     # if ('idUsuario' not in mJson):# se necesita este argumento para la consulta
#     #     return respuesta({
#     #         'estado':ERR_PARAM_NEC,
#     #         'mensaje':(f"Datos requeridos: idUsuario")
#     #     })
# # 
#     # try:
#     #     idUsuario = int(mJson['idUsuario'])
#     # except:
#     #     return respuesta({
#     #         'estado': ERR_PARAM_NEC,
#     #         'mensaje': (f"Datos con formato erróneo: idUsuario")
#     #     })
# 
#     # Creamos un cursor para la consulta
#     try:
#         con = conex()
#         cur = con.cursor()
#     except:
#         return respuesta({
#             'estado': ERR_NO_CONNECT_BD,
#             'mensaje': (f"Problema al conectar a la BD")
#         })
#     
#     try:
#         # Consulta SQL
#         cur.execute(f"""INSERT INTO publicaciones (descripcion)""",
#                     (mJson['descripcion']))
#         res = cur.fetchone() # Confirma la accion de inserción
#         con.close()
#         if (len(res) != 1):
#             return respuesta({
#                 'estado': ERR_OTHER,
#                 'mensaje': ("Error al insertar")
#             })
#         
#         return respuesta({
#             'estado': EST_OK,
#             'mensaje': ("OK")
#         })
#     except:
#         return respuesta({
#             'estado': ERR_OTHER,
#             'mensaje': ("Error al registrar")
#         })