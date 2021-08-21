document.addEventListener('DOMContentLoaded', function () {
	const spanFecha = document.getElementById('fechaNavegacion');
	let fecha = new Date();

	spanFecha.innerHTML = `${fecha.getDate()}/${fecha.getMonth() + 1 }/${fecha.getFullYear()}`;

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
		cargarDatos(buscar);

	});

})