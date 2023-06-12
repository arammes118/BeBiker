import json

def cargaJSON(s):
	#carga de una tabla que está en JSON y la devolvemos como diccionario
	with open(s, encoding='utf-8') as json_file: #cargo el json 
		dic = json.load(json_file)
	return dic 