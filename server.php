<?php
	//importamos la libreria de pusher
	require('libs/Pusher.php');
	//comprobamos que llego un mensaje por el metodo GET
	if($_GET){
		if(isset($_GET['usuario']) && isset($_GET['mensaje']) && isset($_GET['latitud']) && isset($_GET['longitud'])){
			/*creamos un objeto pusher que recibe como parametros */
			$pusher = new Pusher('KEY', 'SECRET', 'APP_ID');
			//Con esta instruccion mandamos el mensaje a todos los usuarios conectados
			//chat:canal de comunicacion,mensaje:evento que escucuhan los usuarios
			$pusher->trigger('chat', 'mensaje', array('usuario'=> $_GET['usuario'],'mensaje' => $_GET['mensaje'],'latitud' => $_GET['latitud'],'longitud' => $_GET['longitud']) );
		}
	}
?>