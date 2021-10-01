document.addEventListener('DOMContentLoaded', function () {
	function datosIngresoEgreso() {
		consulta = "listaIngresoEgreso"
		$.ajax({
			url: "/listaIngresoEgreso",
			method:"POST",
			data:{consulta:consulta},
			success:function (data) {
				$('#ingresosEgresos').html(data)
				$("#ingresosEgresos").append(data.htmlresponse);
			}	
		});
	}

	datosIngresoEgreso();
})