/* Agustín Robaina y Santiago Salinas */

/*Espera a que cargue el html para cargar los addEventListeners*/
window.addEventListener("load", botonesinicio);
/*Crea el objeto system de sistema*/
let system = new sistema();

/*Funcionalidad de botones
  Cada vez que se apreta un botón se actualiza la pagina*/
function botonesinicio() {
    cargarTabla("No hay datos", "No hay datos", "No hay datos", "No hay datos");
    document.getElementById("agregardonante").addEventListener("click", agregardonante);
    document.getElementById("agregardonacion").addEventListener("click", agregardonacion);

    document.getElementById("resaltarFilas").addEventListener("click", actualizar);
    document.getElementById("montoResaltar").addEventListener("click", actualizar);
    document.getElementById("montdec").addEventListener("click", actualizar);
    document.getElementById("nombcre").addEventListener("click", actualizar);

    /*Se muestra unicamente el <p> de quien mas dono, hasta ser modificado*/
    document.getElementById("divMejor").style.display = "block";
    document.getElementById("divMejores").style.display = "none";

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
        'packages': ['corechart']
    });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
}

function agregardonante() {
    /*Consigue los datos del form solo si estan validados*/
    if (document.getElementById("idFormDonante").reportValidity()) {
        let nombre = document.getElementById("nombre").value;
        let direccion = document.getElementById("direccion").value;
        let tel = document.getElementById("telefono").value;


        //Control de nombres repetidos
        //Solo agreg
        if (system.controlrepetidos(nombre) == false) {
            let donor = new donante(nombre, direccion, tel);
            system.agregardonante(donor);
            document.getElementById("idFormDonante").reset();
            cargarCombo(donor);
        } else {
            alert("El nombre ya se encuentra registrado");
        }

    }
    //Solo se resetea el form si el donante fue ingresado correctamente, esto
    //da una sensacion de que los datos fueron "enviados" y si el nombre es
    //repetido, no se "envian". 
}

function cargarCombo(donante) {
    let combo = document.getElementById("idCombo");
    let nodo = document.createElement("option");
    let nodoTexto = document.createTextNode(donante.nombre);
    nodo.appendChild(nodoTexto);
    combo.appendChild(nodo);
}


//Monto Positivo
//Comentario OPCIONAL Y MAX LENGHT 20
function agregardonacion() {

    if (document.getElementById("idFormDonaciones").reportValidity()) {
        let donante = document.getElementById("idCombo").value;
        let modo = document.getElementById("modo").value;
        let monto = document.getElementById("monto").value;
        let comentario = document.getElementById("comentarios").value;

        //Uno pasa los datos en texto y sistem
        //Se encarga de buscar el objeto asociado a ese nombre
        //Y crear un objeto donacion
        system.agregardonacion(donante, modo, monto, comentario);
        actualizar();
    }

}

function actualizar() {
    
    console.log("Actualizado");
    actualizarTabla();
    actualizarEstadisticas();
    drawChart();


}

function cargarTabla(donante, modo, monto, comentario) {
    let tabla = document.getElementById("idTabla");
    let fila = tabla.insertRow();

    if (monto == document.getElementById("montoResaltar").value && document.getElementById("resaltarFilas").checked) {
        fila.style.backgroundColor = "gold";
    }

    let celda = fila.insertCell();
    celda.innerHTML = donante;
    let celda2 = fila.insertCell();
    celda2.innerHTML = modo;


    if (monto >= 1000) {
        let celda3 = fila.insertCell();
        celda3.innerHTML = `<a class="redtext">` + monto + `</a>`;

    } else if (monto < 1000) {
        let celda3 = fila.insertCell();
        celda3.innerHTML = `<a class="greentext">` + monto + `</a>`;
    } else {
        let celda3 = fila.insertCell();
        celda3.innerHTML = monto;
    }

    let celda4 = fila.insertCell();
    celda4.innerHTML = comentario;
}

function actualizarTabla() {

    let tabla = document.getElementById("idTabla");
    tabla.innerHTML = "";

    if (system.donaciones.length == 0) {
        cargarTabla("No hay datos", "No hay datos", "No hay datos", "No hay datos");
    }
    
    if (document.getElementById("montdec").checked == true) {
        system.ordenardonacionesmontdec();
    } else if (document.getElementById("nombcre").checked == true) {
        system.ordenardonacionesnombcre();
    }

    for (let i = 0; i < system.donaciones.length; i++) {
        let donation = system.donaciones[i];
        cargarTabla(donation.donante, donation.modo, donation.monto, donation.comentario);
    }
}

function actualizarEstadisticas() {

    //Total general
    document.getElementById("totalGeneral").innerHTML = "$" + system.totalgeneral();

    //Monto Donación Mayor
    if (system.donaciones.length != 0) {
        document.getElementById("montoDonacionMayor").innerHTML = "$" + system.montdonacionmayor();
    }
    //Cantidad de donaciones
    if (system.donaciones.length > 0) {
        document.getElementById("idCantidad").innerHTML = system.donaciones.length;
    }
    //Promedio donaciones
    if (system.donaciones.length > 0) {
        document.getElementById("idProm").innerHTML = (system.totalgeneral()/(system.donaciones.length)).toFixed(0);
    }

    //Donante que mas veces donó
    let max = 0;
    let veces=[];
    for (let i = 0; i < system.donantes.length; i++) {
        if (system.donantes[i].veces > max) {
            max = system.donantes[i].veces;
            veces = [];
            veces.push(system.donantes[i]);
        } else {
            if (system.donantes[i].veces == max) {
                veces.push(system.donantes[i]);
            }
        }
    }
    vecesmasdonaron(veces);
}




function resetLista() {
    let lista = document.getElementById("idMejores");
    lista.innerHTML = "";
}

function cargarLista(texto) {
    let lista = document.getElementById("idMejores");
    let nodo = document.createElement("li");
    let nodoTexto = document.createTextNode(texto);
    nodo.appendChild(nodoTexto);
    lista.appendChild(nodo);

}

function drawChart() {


    if(system.donaciones.length==0){
        document.getElementById("chart_div").style.display = "none";
    } else {
        document.getElementById("chart_div").style.display = "block";
}

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Modo');
    data.addColumn('number', 'Veces');
    data.addRows([
        ['Efectivo', system.modo[0]],
        ['Transferencia', system.modo[1]],
        ['Canje', system.modo[2]],
        ['Mercaderia', system.modo[3]],
        ['Cheque', system.modo[4]],
        ['Otros', system.modo[5]]
    ]);

    // Set chart options
    var options = {
        'title': 'Donaciones por Modo',
        'width': 800,
        'height': 500
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}


function vecesmasdonaron(veces) {
    resetLista();

    if (veces.length > 1) {
        document.getElementById("divMejor").style.display = "none";
        document.getElementById("divMejores").style.display = "block";
        for (i = 0; i < veces.length; i++) {
            cargarLista(veces[i].nombre);
        }
    } else {
        document.getElementById("divMejor").style.display = "block";
        document.getElementById("divMejores").style.display = "none";
        document.getElementById("textoidMejor").innerHTML = "Donante que mas veces donó: " + veces[0].nombre;
    }
}