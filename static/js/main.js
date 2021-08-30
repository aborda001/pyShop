document.addEventListener('DOMContentLoaded', function () {
	const spanFecha = document.getElementById('fechaNavegacion');
	let fecha = new Date();
	//Coloca la fecha en la navegacion
	spanFecha.innerHTML = `${fecha.getDate()}/${fecha.getMonth() + 1 }/${fecha.getFullYear()}`;	
});