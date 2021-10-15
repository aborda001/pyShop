document.addEventListener('DOMContentLoaded', function() {
	const btnHoy = document.getElementById("btnHoy");
	const bntMes = document.getElementById("btnMes");
	const btnAno = document.getElementById("btnAno");
	const btnAgregarEgreso = document.getElementById("btnAgregarEgreso");
	const btnAgregarIngreso = document.getElementById("btnAgregarIngreso");


	function datosIngresoEgreso(filtroFecha) {
		consulta = filtroFecha;
		$.ajax({
			url: "/listaIngresoEgreso",
			method: "POST",
			data: {
				consulta: consulta
			},
			success: function(data) {
				$('#ingresosEgresos').html(data)
				$("#ingresosEgresos").append(data.htmlresponse);
			}
		});
	}

	function nuevoIngresoEgreso(monto,descripcion,fecha, url) {
		$.ajax({
			url: url,
			method: "POST",
			data: {
				monto:monto,
				descripcion:descripcion,
				fecha:fecha
			},
			success: (data) => {
				$.notify('Agregado correctamente', 'success');
				datosIngresoEgreso("todos");
			},
			error: (error) => {
				$.notify('Ha ocurrido un grave error, vuelve a intentarlo mas tarde', 'danger');
			}
		});
	}

	btnAgregarEgreso.onclick = () => {
		let fecha = $('#fechaModalIE').val();
		let descripcion = $('#descripcionIE').val();
		let monto = $('#montoIE').val();
		url = "/nuevoegreso";

		if (descripcion != " " && monto != " " && fecha != " ") {
			nuevoIngresoEgreso(monto,descripcion,fecha, url);
			$('#fechaModalIE').val(" ");
			$('#descripcionIE').val(" ");
			$('#montoIE').val(" ");
			$('#modalEgresoIngreso').modal('hide');
		}else{
			$.notify('Los campos no pueden estar vacios', 'warning');
		}
	}

	btnAgregarIngreso.onclick = () => {
		let fecha = $('#fechaModalIE').val();
		let descripcion = $('#descripcionIE').val();
		let monto = $('#montoIE').val();
		url = "/nuevoingreso";

		if (descripcion != " " && monto != " " && fecha != "") {
			nuevoIngresoEgreso(monto,descripcion,fecha, url);
			$('#fechaModalIE').val("");
			$('#descripcionIE').val(" ");
			$('#montoIE').val(" ");
			$('#modalEgresoIngreso').modal('hide');
		}else{
			$.notify('Los campos no pueden estar vacios', 'warning');
		}
	}

	btnHoy.onclick = () => {
		datosIngresoEgreso("hoy");
	}

	btnMes.onclick = () => {
		datosIngresoEgreso("mes");
	}

	btnAno.onclick = () => {
		datosIngresoEgreso("ano");
	}
	datosIngresoEgreso("todos");


})