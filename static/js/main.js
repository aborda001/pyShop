document.addEventListener('DOMContentLoaded', function () {
	const spanFecha = document.getElementById('fechaNavegacion');
	const tbody = document.getElementById('resultado');
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
		console.log(e.target.parentNode);
	}
		
});