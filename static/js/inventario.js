document.addEventListener('DOMContentLoaded', function () {
	const modalProducto = document.getElementById('modalProducto');
	const btnAgregarNuevoProducto = document.getElementById('btnAgregarNuevoProducto');

	function datosInventario(consulta) {
		$.ajax({
			url: "/buscarinventario",
			method:"POST",
			data:{consulta:consulta},
			success:function (data) {
				$('#tablainventario').html(data)
				$("#tablainventario").append(data.htmlresponse);
			}	
		});
	}

	function agregarNuevoProducto(codigoProducto,descripcionProducto,precioCompraProducto,precioVentaProducto,stockProducto) {
		let data = {'codigoProducto':codigoProducto,
					'descripcionProducto':descripcionProducto,
					'precioCompraProducto':precioCompraProducto,
					'precioVentaProducto':precioVentaProducto,
					'stockProducto':stockProducto
				}

		$.ajax({
			url:"/nuevoproducto",
			method : "POST",
			contentType : "application/json",
			dataType : "json",
			data : JSON.stringify(data),
			success : (data) => {
				$.notify('El producto fue agregado correctamente', 'success');
				datosInventario("");
				cerrarModal();
			},error: (error) => {
            	$.notify('Ha ocurrido un grave error, vuelve a intentarlo mas tarde', 'danger');
            }
		});

	}

	function cerrarModal() {
		$('#codigoProducto').val("");
		$('#descripcionProducto').val("");
		$('#precioCompraProducto').val("");
		$('#precioVentaProducto').val("");
		$('#stockProducto').val("");
		$(modalProducto).modal('hide');
	}

	$('#buscadorInventario').keyup(function(){
		//llama a la funcion para realizar la consulta
		let buscar = $(this).val();
		datosInventario(buscar);

	});


	btnAgregarNuevoProducto.onclick = () => {
		let codigoProducto = $('#codigoProducto').val();
		let descripcionProducto = $('#descripcionProducto').val();
		let precioCompraProducto = $('#precioCompraProducto').val();
		let precioVentaProducto = $('#precioVentaProducto').val();
		let stockProducto = $('#stockProducto').val();

		agregarNuevoProducto(codigoProducto,descripcionProducto,precioCompraProducto,precioVentaProducto,stockProducto);
	}

	datosInventario("");
});