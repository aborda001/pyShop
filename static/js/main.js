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

	function datosInventario(consulta) {
		$.ajax({
			url: "/buscarinventario",
			method:"POST",
			data:{consulta:consulta},
			success:function (data) {
				$('#tablainventario').html(data)
				$("#tablainventario").append(data.htmlresponse);
				//console.log(data.htmlresponse);
			}	
		});
	}

	function agregarProducto(codigo,nombre,venta) {
		const row = tbodyLista.insertRow();
		let cantidad = 1;
		row.innerHTML = `<td>#</td>
							<td>${codigo}</td>
							<td>${nombre}</td>
							<td>${cantidad}</td>
							<td>${formatearNumero(venta)}</td>
							<td>${formatearNumero(venta * cantidad)}</td>
							<td>

							</td>`
		const botonEditar = document.createElement('button');
		botonEditar.classList.add('btn', 'btn-success', 'ml-1');
		botonEditar.innerHTML = '<i class="fas fa-pen"></i>';
		row.children[6].appendChild(botonEditar);

		const botonSumar = document.createElement('button');
		botonSumar.classList.add('btn', 'btn-primary', 'ml-1');
		botonSumar.innerHTML = '<i class="fas fa-plus"></i>';
		row.children[6].appendChild(botonSumar);

		const botonRestar = document.createElement('button');
		botonRestar.classList.add('btn', 'btn-primary', 'ml-1');
		botonRestar.innerHTML = '<i class="fas fa-minus"></i>';
		row.children[6].appendChild(botonRestar);

		const botonBorrar = document.createElement('button');
		botonBorrar.classList.add('btn', 'btn-danger', 'ml-1');
		botonBorrar.innerHTML = '<i class="fas fa-trash"></i>';
		row.children[6].appendChild(botonBorrar);

		

		botonEditar.onclick = () => {
			console.log('Editando fila');
		}

		botonBorrar.onclick = () => {
			console.log('Borrando fila');
		}

		botonSumar.onclick = () => {
			cantidad++;
			row.children[3].innerText = cantidad;
			row.children[5].innerText = formatearNumero(venta * cantidad);
		}

		botonRestar.onclick = () => {
			cantidad--;
			row.children[3].innerText = cantidad;
			row.children[5].innerText = formatearNumero(venta * cantidad);
		}

	}

	$('#buscador').keyup(function(){
		//llama a la funcion para realizar la consulta
		let buscar = $(this).val();
		datosVenta(buscar);

	});


	$('#buscadorInventario').keyup(function(){
		//llama a la funcion para realizar la consulta
		let buscar = $(this).val();
		datosInventario(buscar);

	});

	datosInventario("");
	datosVenta("");


	tbody.onclick = function (e) {
		const fila = e.target.parentNode
		const codigo = fila.children[0].childNodes[0].data;
		const nombre = fila.children[1].childNodes[0].data;
		const compra = fila.children[2].childNodes[0].data;
		const venta = fila.children[3].childNodes[0].data;
		const stock = fila.children[4].childNodes[0].data;

		agregarProducto(codigo,nombre,venta);
	}
		
});