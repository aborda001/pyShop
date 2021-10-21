from datetime import date
import sqlite3

baseDeDatos = 'database.sqlite'

def ultimoId():
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("SELECT idVenta FROM Venta ORDER BY idVenta DESC LIMIT 1")

	idVenta = cursor.fetchone()
	cursor.close()
	conexion.close()

	return idVenta[0]

def filtroFecha(array,filtro):
	anoActual,mesActual,diaActual = str(date.today()).split("-")
	nuevoArray = []
	total = 0
	if filtro == "hoy":
		for elemento in array:
			diaArray,mesArray,anoArray = elemento[3].split("/")
			if diaArray == diaActual:
				nuevoArray.append(elemento)
				total += float(elemento[1])
		return nuevoArray,total
	elif filtro == "mes":
		for elemento in array:
			diaArray,mesArray,anoArray = elemento[3].split("/")
			if mesArray == mesActual:
				nuevoArray.append(elemento)
				total += float(elemento[1])
		return nuevoArray,total
	elif filtro == "ano":
		for elemento in array:
			diaArray,mesArray,anoArray = elemento[3].split("/")
			if anoArray == anoActual:
				nuevoArray.append(elemento)
				total += float(elemento[1])
		return nuevoArray,total