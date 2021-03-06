function formatearNumero(n) {
	n = n * 1;
	n = String(n).replace(/\D/g, "");

	return n === '' ? n : Number(n).toLocaleString();
}

document.addEventListener('DOMContentLoaded', function() {
	const fechaModal = document.getElementById('fechaModal');
	const tbody = document.getElementById('resultado');
	const tablaLista = document.getElementById('tablaListaCompras');
	const tbodyLista = tablaLista.getElementsByTagName('tbody')[0];
	const botonVenta = document.getElementById('btnRegistrarVenta');
	const noHay = document.getElementById('NoHay');
	const ventaTotalSpan = document.getElementById('totalVenta');
	const ventaTotalModal = document.getElementById('totalVentaModal');
	const precioAnterior = document.getElementById('precioAnterior');
	const btnEditarPrecio = document.getElementById('btnEditarPrecio');
	const btnGenerarVenta = document.getElementById('btnGenerarVenta');
	let totalVenta = 0;
	let idRow = 1;
	let fecha = new Date();
	let fila, precio;

	//Ajax Modal
	function datosVenta(consulta) {
		//Hace la consulta en la base de datos dependiendo de lo que se ingrese en el buscador
		$.ajax({
			url: "/buscador",
			method: "POST",
			data: {
				consulta: consulta
			},
			success: (data) => {
				$('#resultado').html(data)
				$("#resultado").append(data.htmlresponse);
			}
		});
	}

	function completarVenta(cliente, total, fecha) {
		cliente = cliente == false ? 'Cliente ocacional' : cliente;

		let datosVenta = {
			Cliente: cliente,
			Fecha: fecha,
			Total: total,
		}

		if (total != '0') {
			$.ajax({
				url: "/completarventa",
				method: "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(datosVenta),
				success: (data) => {
					enviarDetalleVenta();
				},
				error: (error) => {
					$.notify('Ha ocurrido un grave error, vuelve a intentarlo mas tarde', 'danger');
				}
			});
		} else {
			$.notify("El total de la venta debe ser mayor O", "warning");
		}
	}

	function enviarDetalleVenta() {
		let detallesVenta = []
		let idProducto, cantidad, precio, total, detalle;

		for (lista of tbodyLista.children) {
			idProducto = lista.getAttribute('idProducto');
			cantidad = lista.children[3].innerText;
			precio = lista.children[4].innerText.replace(/\D/g, '');
			total = lista.children[5].innerText.replace(/\D/g, '');
			detalle = {
				'idProducto': idProducto,
				'cantidad': cantidad,
				'precio': precio.replace(/\D/g, ''),
				'total': total.replace(/\D/g, '')
			}
			detallesVenta.push(detalle);
		}

		$.ajax({
			url: '/detalleventa',
			method: 'POST',
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(detallesVenta),
			success: (data) => {
				$.notify('La venta se ha procesado correctamente', 'success');
				setTimeout(() => {
					location.reload();
				}, 1900);
			},
			error: (error) => {
				$.notify('Ha ocurrido un grave error, vuelve a intentarlo mas tarde', 'danger');
			}
		});
	}

	//Agrega los productos a la lista la compra con todos los eventos de los botones
	function agregarProducto(codigo, nombre, venta, idProducto) {
		const row = tbodyLista.insertRow();
		row.setAttribute('id', idRow++);
		row.setAttribute('idProducto', idProducto);
		let cantidad = 1;
		let total = cantidad * venta;
		totalVenta = totalVenta + total;
		ventaTotalSpan.innerHTML = formatearNumero(totalVenta);

		row.innerHTML = `<td>${idRow - 1}</td>
							<td>${codigo}</td>
							<td>${nombre}</td>
							<td>${cantidad}</td>
							<td>${formatearNumero(venta)}</td>
							<td>${formatearNumero(total)}</td>
							<td>

							</td>`
		const botonEditar = document.createElement('button');
		botonEditar.classList.add('btn', 'btn-success', 'mx-1');
		botonEditar.innerHTML = '<i class="fas fa-pen"></i>';
		row.children[6].appendChild(botonEditar);

		const botonSumar = document.createElement('button');
		botonSumar.classList.add('btn', 'btn-primary', 'mx-1');
		botonSumar.innerHTML = '<i class="fas fa-plus"></i>';
		row.children[6].appendChild(botonSumar);

		const botonRestar = document.createElement('button');
		botonRestar.classList.add('btn', 'btn-primary', 'mx-1');
		botonRestar.innerHTML = '<i class="fas fa-minus"></i>';
		row.children[6].appendChild(botonRestar);

		const botonBorrar = document.createElement('button');
		botonBorrar.classList.add('btn', 'btn-danger', 'mx-1');
		botonBorrar.innerHTML = '<i class="fas fa-trash"></i>';
		row.children[6].appendChild(botonBorrar);



		botonEditar.onclick = () => {
			filaEditar = row.getAttribute('id');
			precioAnterior.innerHTML = formatearNumero(venta)
			$('#modalEditarPrecio').modal('show');
		}

		botonBorrar.onclick = () => {
			filaBorrar = row.getAttribute('id');
			document.getElementById(filaBorrar).remove();
			total = row.children[5].innerText.replace(/\D/g, "");
			totalVenta = totalVenta - total;
			ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
			if (tbodyLista.firstElementChild === null) {
				tbodyLista.appendChild(noHay);
			}
		}

		botonSumar.onclick = () => {
			cantidad++;
			row.children[3].innerText = cantidad;
			venta = row.children[4].innerText.replace(/\D/g, "");
			total = row.children[5].innerText.replace(/\D/g, "");
			row.children[5].innerText = formatearNumero(venta * cantidad);
			let diferencia = total - (venta * cantidad);
			total = venta * cantidad;
			totalVenta = totalVenta - diferencia;
			ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
		}

		botonRestar.onclick = () => {
			cantidad--;
			row.children[3].innerText = cantidad;
			venta = row.children[4].innerText.replace(/\D/g, "");
			total = row.children[5].innerText.replace(/\D/g, "");
			row.children[5].innerText = formatearNumero(venta * cantidad);
			diferencia = total - (venta * cantidad);
			total = venta * cantidad;
			totalVenta = totalVenta - diferencia;
			ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
			if (cantidad === 0) {
				filaBorrar = row.getAttribute('id');
				document.getElementById(filaBorrar).remove();
			}
		}

	}

	//Editar el precio del producto
	function editarPrecio(id, precioEditado) {
		fila = document.getElementById(id);
		totalAnterior = fila.children[5].innerText.replace(/\D/g, "");
		precio = fila.children[4];
		cantidad = fila.children[3].innerText;
		precio.innerHTML = formatearNumero(precioEditado);
		total = precioEditado * cantidad;
		fila.children[5].innerText = formatearNumero(total);

		diferencia = totalAnterior - (precioEditado * cantidad);
		totalVenta = totalVenta - diferencia;
		ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
	}


	$('#buscador').keyup(function() {
		//llama a la funcion para realizar la consulta
		let buscar = $(this).val();
		datosVenta(buscar);

	});

	$("#intEditarPrecio").keydown(function(e) {
		if (e.keyCode == 13) {
			let precionuevo = $('#intEditarPrecio').val();
			if (precionuevo > 0) {
				$.notify('El precio ha sido editado', 'success');
				editarPrecio(filaEditar, precionuevo);
				$('#intEditarPrecio').val('');
				$('#modalEditarPrecio').modal('hide');
			} else {
				$.notify('El precio debe ser mayor a 0', 'warning');
			}
		}
	});

	datosVenta("");


	tbody.onclick = function(e) {
		const fila = e.target.parentNode
		const idProducto = fila.getAttribute('id');
		const codigo = fila.children[0].childNodes[0].data;
		const nombre = fila.children[1].childNodes[0].data;
		const compra = fila.children[2].childNodes[0].data;
		const venta = fila.children[3].childNodes[0].data;
		const stock = fila.children[4].childNodes[0].data;

		if (noHay !== null) {
			noHay.remove();
		}

		$.notify('El producto ha sido agregado a la lista', 'success');
		agregarProducto(codigo, nombre, venta, idProducto);
	}


	botonVenta.onclick = () => {
		ventaTotalModal.innerHTML = formatearNumero(totalVenta);
		fechaModal.innerHTML = `${fecha.getDate()}/
								${fecha.getMonth() + 1 }/
								${fecha.getFullYear()}`;
	}


	btnEditarPrecio.onclick = () => {
		let precionuevo = $('#intEditarPrecio').val();
		if (precionuevo > 0) {
			$.notify('El precio ha sido editado', 'success');
			editarPrecio(filaEditar, precionuevo);
			$('#intEditarPrecio').val('');
			$('#modalEditarPrecio').modal('hide');
		} else {
			$.notify('El precio debe ser mayor a 0', 'warning');
		}
	}

	btnGenerarVenta.onclick = () => {
		let cliente, total, venta;
		cliente = $('#nombreCliente').val();
		total = ventaTotalModal.innerText.replace(/\D/g, '');
		fecha = fechaModal.innerText;

		completarVenta(cliente, total, fecha);
	}
});