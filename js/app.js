var map,mar,mars;
var lats,lat;
var lons,lon;
var j,x,z;
var yaenvio;
var popups;


$(document).ready(function() {
    //inicializacion de variables
    lats = new Array();
    lons = new Array();
    mars = new Array();
    popups = new Array();
    j = 0;
    x = 0;
    z = 620;
    yaenvio = false;

    //inicializamos pusher con la KEY
    var pusher = new Pusher('9cc0bc2e04c995ae545e');
    //suscribirse al canal de comunicacion
    var channel = pusher.subscribe('chat');
    //escuchar un evento llamado mesaje
    channel.bind('mensaje', function(data) {
        //configuramos el div del popup del mensaje
        var men = $('<div id="content">'+
          '<div style="height:10px">'+
          '</div>'+
          '<h5 class="firstHeading">'+data.usuario+'</h5>'+
          '<div id="bodyContent">'+
          '<p>'+data.mensaje+'</p>'+
          '</div>'+
          '</div>');
        //buscamos si el usuario ya habia enviado mensajes
        for (var i = 0; i < lats.length; i++) {
            if(lats[i]==data.latitud){
                yaenvio=true;
                x = i;
                break;
            }
        };
        //Si ya envio solo actualizamos su ventana con el nuevo mensaje
        if(yaenvio){
            popups[x].setContent(men[0]);
            popups[x].setZIndex(z++);
            popups[x].open(map, mars[x]);
            yaenvio = false;
        //Si no ah enviado entonces creamos el marcador, creamos la infowindow para mostrar
        //el mensaje y guardamos los datos del usuario
        }else{
            mars[j] = cargarMarcador(mars[j],map,data.latitud,data.longitud,false,'marker.png');
            popups[j] = popup = new google.maps.InfoWindow({
                content: men[0],
                zIndex: z
            });
            mars[j].nb = j;
            popups[j].open(map, mars[j]);
            lats[j] = data.latitud;
            lons[j] = data.longitud;
            j++;
            z++;
        }
    });

    //Cada que se de enter en el text area se envia el mensaje
    $('#mymsg').keyup(function(event) {
        event.preventDefault();
        if(event.keyCode == 13)enviarMensaje();
    });
    //cargamos el mapa
    map = cargarMapa(map,lat = 0,lon = 0);
    //llamar la funcion de geolocalizacion
    gps();
});

//funcion para cargar el mapa
function cargarMapa(map,lat,lon){
    if(map == undefined){
        var mapOptions = {
            center: new google.maps.LatLng(lat, lon),
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scrollwheel: true,
            panControl:false,
            streetViewControl:false
        };
        map = new google.maps.Map(document.getElementById('map'),mapOptions);
    }
    else{
        centrarMapa(map,lat,lon);
    }
    return map;
}

//funcion que centra el mapa
function centrarMapa(map,lat,lon){
    map.panTo(new google.maps.LatLng(lat, lon));
}

//funcion para poner un marcador
function cargarMarcador(mar,map,lat,lon,dr,im){
    if(mar == undefined){
     var mar = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        draggable:dr,
        icon: im,
    });
     mar.setMap(map);
 }
 else{
    mar.setPosition(new google.maps.LatLng(lat, lon));
}
centrarMapa(map,lat,lon);
return mar;
}


//funcion de geolocalizacion
function gps(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(pos){
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
        }, function(err){
            lat = 0;
            lon = 0;
            alert("Error Al Localizar");
        }, {enableHighAccuracy:true, timeout: 10000,maximumAge: 500});
    }
    else
    {
        lat = 0;
        lon = 0;
        alert("Error Al Localizar");
    }
}

//funcion que envia el mensaje al servidor
function enviarMensaje(){
    //recuperamos lo que se escribio
    msg = $('#mymsg').val();
    $('#mymsg').val('');
    //si no se escribio nada regresamos
    if(msg.length == 0 )return;
    
    //comprobamos que ya se haya elegido un nombre de usuario
    //Si no se ha elegido le damos la opcion de elegir uno y lo guardamos 
    //en el localStorage(cache)
    if(!localStorage.getItem('user')){
        usuario = prompt("Ingresa Tu Nombre", "Harry Potter");
        if(usuario.length == 0 )return;
        localStorage.setItem('user',usuario);
    }
    //si ya hay un nombre de usuario solo lo tomamos del localStorage
    else{
        usuario = localStorage.getItem('user');
    }
    //enviamos el mensaje al servidor mediante AJAX
    $.get('server.php',{usuario:usuario,mensaje:msg,latitud:lat,longitud:lon},function(data) {
    });
}


