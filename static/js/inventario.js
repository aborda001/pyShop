document.addEventListener('DOMContentLoaded', function () {

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

	$('#buscadorInventario').keyup(function(){
			//llama a la funcion para realizar la consulta
			let buscar = $(this).val();
			datosInventario(buscar);

		});

	datosInventario("");
});