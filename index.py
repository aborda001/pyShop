from flask import Flask, request, jsonify, render_template, url_for
import sqlite3,re
from datetime import date
from funciones import *

baseDeDatos = 'database.sqlite'
app = Flask(__name__)

@app.route("/")
def inicio():
	return render_template('index.html')

@app.route("/vender")
def vender():
	return render_template('vender.html')

@app.route("/inventario", methods=['GET'])
def productos():
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()
	cursor.execute("SELECT * FROM productos")
	productos = cursor.fetchall()
	cursor.close()
	conexion.close()
	return render_template("inventario.html", productos = productos)

@app.route("/caja")
def caja():
	return render_template("caja.html")

@app.route("/reporte")
def reporte():
	return render_template("reporte.html")

@app.route("/buscador", methods = ["POST"])
def buscador():
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()
	buscar = request.form['consulta']
	if buscar == '':
		cursor.execute("SELECT * FROM Productos")
		productos = cursor.fetchall()
	else:
		cursor.execute(f"SELECT * FROM Productos WHERE descripcionProducto LIKE '%{buscar}%'")
		productos = cursor.fetchall()
	cursor.close()
	conexion.close()
	return jsonify({'htmlresponse': render_template('productosvender.html', productos=productos)})	

@app.route("/buscarinventario", methods = ["POST"])
def buscadorinventario():
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()
	buscar = request.form['consulta']
	if buscar == '':
		cursor.execute("SELECT * FROM Productos")
		productos = cursor.fetchall()
	else:
		cursor.execute(f"SELECT * FROM Productos WHERE descripcionProducto LIKE '%{buscar}%'")
		productos = cursor.fetchall()
	cursor.close()
	conexion.close()
	return jsonify({'htmlresponse': render_template('productosinventario.html', productos=productos)})		

@app.route("/listaIngresoEgreso", methods = ["POST"])
def listaIngresoEgreso():
	consulta = request.form['consulta'].lower()
	totalIngreso = 0
	totalEgreso = 0

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()
	cursor.execute("SELECT * FROM Ingresos")
	ingresos = cursor.fetchall()

	cursor.execute("SELECT * FROM Egresos")
	egresos = cursor.fetchall()

	cursor.close()
	conexion.close()

	if consulta != "todos":
		ingresos,totalIngreso = filtroFecha(ingresos,consulta)
		egresos,totalEgreso = filtroFecha(egresos,consulta)
		return jsonify({'htmlresponse': render_template('listaEI.html', ingresos=ingresos, egresos=egresos, totalIngreso=totalIngreso, totalEgreso=totalEgreso)})

	for ingreso in ingresos:
		totalIngreso += int(ingreso[1])
	for egreso in egresos:
		totalEgreso += int(egreso[1])

	return jsonify({'htmlresponse': render_template('listaEI.html', ingresos=ingresos, egresos=egresos, totalIngreso=totalIngreso, totalEgreso=totalEgreso)})

@app.route("/listareporte", methods=['POST'])
def listareporte():
	consulta = request.form['consulta'].lower()

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("SELECT * FROM Ingresos")
	ingresos = cursor.fetchall()

	cursor.execute("SELECT * FROM Egresos")
	egresos = cursor.fetchall()

	cursor.execute("SELECT * FROM Venta")
	venta = cursor.fetchall()

	cursor.close()
	conexion.close()

	_,totalIngreso = filtroFecha(ingresos, consulta)
	_,totalEgreso = filtroFecha(egresos, consulta)
	_,totalVenta = filtroFecha(venta, consulta)

	totalCaja = (totalIngreso + totalVenta) - totalEgreso

	totalVenta = '{:,}'.format(totalVenta)
	totalIngreso = '{:,}'.format(totalIngreso)
	totalEgreso = '{:,}'.format(totalEgreso)
	totalCaja = '{:,}'.format(totalCaja)

	return jsonify({'htmlresponse': render_template('listareporte.html', totalIngreso=totalIngreso, totalEgreso=totalEgreso, totalVenta=totalVenta, totalCaja=totalCaja)})

@app.route("/nuevoproducto", methods=['POST'])
def nuevoproducto():
	datosProductos = request.json
	codigoProducto = datosProductos['codigoProducto']
	descripcionProducto = datosProductos['descripcionProducto']
	precioCompraProducto = datosProductos['precioCompraProducto']
	precioVentaProducto = datosProductos['precioVentaProducto']
	stockProducto = datosProductos['stockProducto']

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("INSERT INTO Productos VALUES(null,'%s','%s',%s,%s,%s)"%(codigoProducto,descripcionProducto,precioCompraProducto,precioVentaProducto,stockProducto))

	conexion.commit()
	cursor.close()
	conexion.close()
	

	return jsonify({'Recibido':"Recibido"})

@app.route("/actualizarProducto/<id>", methods=['POST', 'GET'])
def actualizarProducto(id):
	if request.method == 'GET':
		conexion = sqlite3.connect(baseDeDatos)
		cursor = conexion.cursor()
		cursor.execute("SELECT * FROM Productos WHERE idProducto = '%s'" % (id))
		producto = cursor.fetchone()
		cursor.close()
		conexion.close()
		return render_template("editarProducto.html",producto = producto)

	codigoProducto = request.form['codigoProducto']
	descripcionProducto = request.form['descripcionProducto']
	precioCompraProducto = float(request.form['precioCompraProducto'])
	precioVentaProducto = float(request.form['precioVentaProducto'])
	stockProducto = int(request.form['stockProducto'])

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("""UPDATE Productos SET 
					codigoProducto = '%s',
					descripcionProducto = '%s',
					precioCompraProducto = %s,
					precioVentaProducto = %s,
					stockProducto = %s
					WHERE idProducto = %s
					 """%
					 (codigoProducto,descripcionProducto,precioCompraProducto,precioVentaProducto,stockProducto,id))

	conexion.commit()
	cursor.close()
	conexion.close()

	return render_template("inventario.html")

@app.route("/eliminarProducto/<id>")
def eliminarProducto(id):
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("DELETE FROM Productos WHERE idProducto = %s" % (id))

	conexion.commit()
	cursor.close()
	conexion.close()
	return render_template("inventario.html")

@app.route("/nuevoingreso", methods=['POST'])
def nuevoingreso():
	monto = request.form['monto']
	descripcion = request.form['descripcion']
	fecha = request.form['fecha']
	
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("INSERT INTO Ingresos VALUES(null,%s, '%s', '%s')"%(monto,descripcion,fecha))

	conexion.commit()
	cursor.close()
	conexion.close()

	return jsonify({'Recibido':"Recibido"})

@app.route("/nuevoegreso", methods=['POST'])
def nuevoegreso():
	monto = request.form['monto']
	descripcion = request.form['descripcion']
	fecha = request.form['fecha']
	
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("INSERT INTO Egresos VALUES(null,%s, '%s', '%s')"%(monto,descripcion,fecha))

	conexion.commit()
	cursor.close()
	conexion.close()
	
	return jsonify({'Recibido':"Recibido"})

@app.route('/completarventa', methods=['POST'])
def completarventa():
	ano,mes,dia = str(date.today()).split("-")
	datosVenta = request.json
	cliente = datosVenta['Cliente']
	fecha = f"{dia}/{mes}/{ano}"
	total = float(re.sub("\,|\.","",datosVenta['Total']))

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("INSERT INTO Venta VALUES(null,%s, '%s', '%s')" % (total,cliente,fecha))
	conexion.commit()

	cursor.close()
	conexion.close()

	return jsonify({'Recibido':"Recibido"})


@app.route('/detalleventa', methods=['POST'])
def detalleventa():
	datosDetalle = request.json
	idVenta = ultimoId()

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	for dato in datosDetalle:
		idProducto = int(dato['idProducto'])
		cantidad = int(dato['cantidad'])
		precio = float(dato['precio'])
		total = float(dato['total'])

		cursor.execute("INSERT INTO Detalle VALUES(null,%s, %s, %s, %s, %s)" % (idVenta,idProducto,cantidad,precio,total))
		conexion.commit()

	cursor.close()
	conexion.close()

	return jsonify({'Respuesta:':f"Recibi {len(datosDetalle)} productos"})

if __name__ == '__main__':
	app.run(port=5000,
		host="127.0.0.1")