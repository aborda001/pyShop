//document.addEventListener('DOMContentLoaded', function () {
	const botonBuscar = document.getElementById('botonBuscar');

	botonBuscar.onclick = function () {
		console.log("Presionado")	
	}

	function cargarDatos(consulta) {
		$.ajax({
			url:"/buscador",
			method:"POST",
			data:{consulta:consulta},
			success:function (data) {
				$('#resultado').html(data)
				$("#resultado").append(data.htmlresponse);
				console.log(data.htmlresponse);
			}
		});
	}

	$('#buscador').keyup(function(){
		let buscar = $(this).val();

		if(buscar != ''){
			cargarDatos(buscar);
		}

	});


//})