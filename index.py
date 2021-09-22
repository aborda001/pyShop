from flask import Flask, request, jsonify, render_template, url_for
import sqlite3

baseDeDatos = 'database.db'
app = Flask(__name__)

def ultimoId():
	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("SELECT idVenta FROM Venta ORDER BY idVenta DESC LIMIT 1")

	idVenta = cursor.fetchone()
	cursor.close()
	conexion.close()

	return idVenta[0]

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

	Insertados = {
		'monto':monto,
		'descripcion':descripcion,
		'fecha':fecha
	}		
	return jsonify(Insertados)

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

	Insertados = {
		'monto':monto,
		'descripcion':descripcion,
		'fecha':fecha
	}		
	return jsonify(Insertados)

@app.route('/completarventa', methods=['POST'])
def completarventa():
	datosVenta = request.json
	cliente = datosVenta['Cliente']
	fecha = datosVenta['Fecha']
	total = float(datosVenta['Total'])

	conexion = sqlite3.connect(baseDeDatos)
	cursor = conexion.cursor()

	cursor.execute("INSERT INTO Venta VALUES(null,'%s', '%s', %s)" % (cliente,fecha,total))
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
		host="127.0.0.1",
		debug=True)