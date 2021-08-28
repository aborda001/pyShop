const spanFecha = document.getElementById('fechaNavegacion');
let fecha = new Date();
//Coloca la fecha en la navegacion
spanFecha.innerHTML = `${fecha.getDate()}/${fecha.getMonth() + 1 }/${fecha.getFullYear()}`;

function formatearNumero(n) {
	n = n*1;
	n = String(n).replace(/\D/g, "");

	return n === '' ? n : Number(n).toLocaleString();
}

document.addEventListener('DOMContentLoaded', function () {
	const tbody = document.getElementById('resultado');
	const tablaLista = document.getElementById('tablaListaCompras');
	const tbodyLista = tablaLista.getElementsByTagName('tbody')[0];
	const botonVenta = document.getElementById('btnRegistrarVenta');
	const noHay = document.getElementById('NoHay');
	const ventaTotalSpan = document.getElementById('totalVenta');
	let totalVenta = 0;
	let idRow = 1;

	function datosVenta(consulta) {
		//Hace la consulta en la base de datos dependiendo de lo que se ingrese en el buscador
		$.ajax({
			url:"/buscador",
			method:"POST",
			data:{consulta:consulta},
			success:function (data) {
				$('#resultado').html(data)
				$("#resultado").append(data.htmlresponse);
				//console.log(data.htmlresponse);
			}
		});
	}

	function agregarProducto(codigo,nombre,venta) {
		const row = tbodyLista.insertRow();
		row.setAttribute('id',idRow++);
		let cantidad = 1;
		let total = cantidad * venta;
		totalVenta = totalVenta + total;
		ventaTotalSpan.innerHTML = formatearNumero(totalVenta);

		row.innerHTML = `<td>#</td>
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
			console.log('Editando fila');
		}

		botonBorrar.onclick = () => {
			filaBorrar = row.getAttribute('id');
			document.getElementById(filaBorrar).remove();
			totalVenta = totalVenta - total;
			ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
		}

		botonSumar.onclick = () => {
			cantidad++;
			row.children[3].innerText = cantidad;
			row.children[5].innerText = formatearNumero(venta * cantidad);
			let diferencia = total - (venta * cantidad);
			total = venta * cantidad;
			totalVenta = totalVenta - diferencia;
			ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
		}

		botonRestar.onclick = () => {
			cantidad--;
			row.children[3].innerText = cantidad;
			row.children[5].innerText = formatearNumero(venta * cantidad);
			diferencia = total - (venta * cantidad);
			total = venta * cantidad;
			totalVenta = totalVenta - diferencia;
			ventaTotalSpan.innerHTML = formatearNumero(totalVenta);
		}

	}

	$('#buscador').keyup(function(){
		//llama a la funcion para realizar la consulta
		let buscar = $(this).val();
		datosVenta(buscar);

	});

	datosVenta("");


	tbody.onclick = function (e) {
		const fila = e.target.parentNode
		const codigo = fila.children[0].childNodes[0].data;
		const nombre = fila.children[1].childNodes[0].data;
		const compra = fila.children[2].childNodes[0].data;
		const venta = fila.children[3].childNodes[0].data;
		const stock = fila.children[4].childNodes[0].data;

		if (noHay !== null){
			noHay.remove();
		}

		agregarProducto(codigo,nombre,venta);
	}


	botonVenta.onclick = () =>	{
		console.log("Registrar Venta")
	}
		
});