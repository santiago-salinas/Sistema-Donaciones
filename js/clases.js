/* Agustín Robaina y Santiago Salinas */

class sistema {
    constructor() {
        this.donantes = [];
        this.donaciones = [];
        //this.modo=[Efectivo,Transferencia,Canje,Cheque,Otros];
        this.modo = [0, 0, 0, 0, 0, 0];
    }

    agregardonante(objetodonante) {
        this.donantes.push(objetodonante);
    }
   
    controlrepetidos(nombre) {
        let repeticion = false;
        for (let i = 0; i < this.donantes.length; i++ && !repeticion) {
            if (this.donantes[i].nombre.toUpperCase() == nombre.toUpperCase()) {
                repeticion = true;
            }
        }
        return repeticion;
    }

    agregardonacion(donante, modo, monto, comentario) {

        //Busca el objeto donante con el nombre
        for (let i = 0; i < this.donantes.length; i++) {
            if (donante == this.donantes[i].nombre) {
                donante = this.donantes[i];
            }
        }
        //Aumenta 1 vez la cantidad de donaciones
        donante.veces += 1;

        //Aumenta 1 vez el tipo de transaccion
        //Google Chart
        switch (modo) {
            case "Efectivo":
                this.modo[0] += 1;
                break;

            case "Transferencia":
                this.modo[1] += 1;
                break;

            case "Canje":
                this.modo[2] += 1;
                break;

            case "Mercaderia":
                this.modo[3] += 1;
                break;

            case "Cheque":
                this.modo[4] += 1;
                break;

            case "Otros":
                this.modo[5] += 1;
                break;

            default:
                break;
        }

        
        let objetodonacion = new donacion(donante, modo, monto, comentario);
        this.donaciones.push(objetodonacion);
    }
    //Funciones actualizar

totalgeneral(){
    let totaldonaciones = 0;
    for (let i = 0; i < system.donaciones.length; i++) {
        totaldonaciones = totaldonaciones + parseInt(system.donaciones[i].monto);
    }
    return totaldonaciones;
}

montdonacionmayor(){
let max=0;

for(let i=0;i<system.donaciones.length;i++){
    if(system.donaciones[i].monto>max){
        max = system.donaciones[i].monto;
        }
        return max
}


}

    ordenardonacionesmontdec() {
        this.donaciones.sort(function (a, b) {
            return b.compararConMonto(a);
        });
    }

    ordenardonacionesnombcre() {
        this.donaciones.sort(function (a, b) {
            return a.compararConNombre(b);
        });
    }
}


/*Registro de donantes*/
class donante {
    constructor(nombre, direccion, telefono) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.veces = 0;
    }

    compararConVeces(otro) {
        return parseInt(otro.veces) - parseInt(this.veces);
    }

    toString() {
        return (this.nombre + " (" + this.direccion + ", " + this.telefono + ")");
    }

}

/*Registro de donaciones*/
class donacion {
    constructor(donante, modo, monto, comentario) {
        this.donante = donante;
        this.modo = modo;
        this.monto = monto;
        this.comentario = comentario;
    }

    compararConMonto(otro) {
        return parseInt(this.monto) - parseInt(otro.monto);
    }

    compararConNombre(otro) {
        return this.donante.nombre.toUpperCase().localeCompare(otro.donante.nombre.toUpperCase());
    }


}