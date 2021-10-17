document.addEventListener('DOMContentLoaded', function() {
	const btnHoy = document.getElementById("btnHoy");
	const bntMes = document.getElementById("btnMes");
	const btnAno = document.getElementById("btnAno");

	function datosReporteCaja(filtroFecha) {
		consulta = filtroFecha;
		$.ajax({
			url: "/listareporte",
			method: "POST",
			data: {
				consulta: consulta
			},
			success: function(data) {
				$('#reporte').html(data)
				$("#reporte").append(data.htmlresponse);
			}
		});
	}

	btnHoy.onclick = () => {
		datosReporteCaja("hoy");
	}

	btnMes.onclick = () => {
		datosReporteCaja("mes");
	}

	btnAno.onclick = () => {
		datosReporteCaja("ano");
	}
	
	datosReporteCaja("ano");
})