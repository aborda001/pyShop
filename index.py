from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)


@app.route("/")
def inicio():
	return "<p>hello</p>"

@app.route("/productos", methods=['GET'])
def productos():
	conexion = sqlite3.connect('database.db')
	cursor = conexion.cursor()
	cursor.execute("SELECT * FROM productos")
	productos = cursor.fetchall()
	cursor.close()
	conexion.close()
	return jsonify(productos)

@app.route("/producto/<id>")
def producto(id):
	return f"<p>producto:{id} </p>"

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

if __name__ == '__main__':
	app.run(port=5000,host="127.0.0.1",debug=True)