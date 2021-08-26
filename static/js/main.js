document.addEventListener('DOMContentLoaded', function () {
	const spanFecha = document.getElementById('fechaNavegacion');
	const tbody = document.getElementById('resultado');
	const tablaLista = document.getElementById('tablaListaCompras')
	const tbodyLista = tablaLista.getElementsByTagName('tbody')[0];
	let fecha = new Date();
	
	//Coloca la fecha en la navegacion
	spanFecha.innerHTML = `${fecha.getDate()}/${fecha.getMonth() + 1 }/${fecha.getFullYear()}`;

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

	function agregarProducto(codigo,nombre,venta,id) {
		const row = tbodyLista.insertRow()
		row.innerHTML = `<td>${id++}</td>
							<td>${codigo}</td>
							<td>${nombre}</td>
							<td>1</td>
							<td>${venta}</td>
							<td>${venta}</td>
							<td>
								<i class="fas fa-pen"></i>
								<i class="fas fa-trash"></i>
								<i class="fas fa-plus"></i>
								<i class="fas fa-minus"></i>
							</td>`
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

		agregarProducto(codigo,nombre,venta,id);
	}
		
});