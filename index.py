from flask import Flask, request, jsonify, render_template, url_for
import sqlite3

app = Flask(__name__)


@app.route("/")
def inicio():
	return render_template('index.html')

@app.route("/vender")
def vender():
	return render_template('vender.html')

@app.route("/inventario", methods=['GET'])
def productos():
	conexion = sqlite3.connect('database.db')
	cursor = conexion.cursor()
	cursor.execute("SELECT * FROM productos")
	productos = cursor.fetchall()
	cursor.close()
	conexion.close()
	return render_template("inventario.html", productos = productos)

@app.route("/buscador", methods = ["POST"])
def buscador():
	conexion = sqlite3.connect('database.db')
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
	conexion = sqlite3.connect('database.db')
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
	codigoProducto = request.form['codigoProducto']
	descripcionProducto = request.form['descripcionProducto']
	precioCompraProducto = request.form['precioCompraProducto']
	precioVentaProducto = request.form['precioVentaProducto']
	stockProducto = request.form['stockProducto']

	conexion = sqlite3.connect('database.db')
	cursor = conexion.cursor()

	cursor.execute("INSERT INTO Productos VALUES(null,'%s','%s',%s,%s,%s)"%(codigoProducto,descripcionProducto,precioCompraProducto,precioVentaProducto,stockProducto))

	conexion.commit()
	cursor.close()
	conexion.close()

	return "<p>Agregado</p>"

@app.route("/nuevoingreso", methods=['POST'])
def nuevoingreso():
	monto = request.form['monto']
	descripcion = request.form['descripcion']
	fecha = request.form['fecha']
	
	conexion = sqlite3.connect('database.db')
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
	
	conexion = sqlite3.connect('database.db')
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
	for dato in datosVenta:
		print(datosVenta[dato])
	return jsonify({'Recibido':"Recibido"})

if __name__ == '__main__':
	app.run(port=5000,
		host="127.0.0.1",
		debug=True)