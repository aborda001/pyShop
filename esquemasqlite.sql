CREATE TABLE IF NOT EXISTS Productos (
	idProducto INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	codigoProducto TEXT UNIQUE,
	descripcionProducto TEXT NOT NULL,
	precioCompraProducto REAL NOT NULL,
	precioVentaProducto REAL NOT NULL,
	stockProducto INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Venta (
	idVenta INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	monto REAL NOT NULL,
	cliente TEXT,
	fecha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Detalle (
	idDetalle INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	idVenta INTEGER NOT NULL,
	idProducto INTEGER NOT NULL,
	cantidad INTEGER NOT NULL,
	precio REAL NOT NULL,
	monto REAL NOT NULL,
	foreign key (idVenta) references Venta (idVenta)
		on delete cascade
		on update cascade,
	foreign key (idProducto) references Productos (idProducto)
		on delete cascade
		on update cascade
);

CREATE TABLE IF NOT EXISTS Ingresos (
	idIngreso INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	monto REAL NOT NULL,
	descripcion TEXT NOT NULL,
	fecha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Egresos (
	idEngreso INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	monto REAL NOT NULL,
	descripcion TEXT NOT NULL,
	fecha TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS restar_stock 
    AFTER INSERT ON Detalle
    FOR EACH ROW
BEGIN
    UPDATE Productos
    SET stockProducto = stockProducto - NEW.cantidad
    WHERE idProducto = NEW.idProducto;
END;