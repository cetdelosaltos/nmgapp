import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertirFechasService {

  constructor() { }
  timestamp(dia: any, hora: any) {
    const FechaTotal = dia + "T" + hora;
    const fechautc = new Date(FechaTotal);
    const fechafinal = fechautc.getTime();
    return fechafinal;
  }
  fecha(tiempo: any) {
    var fechares = new Date(tiempo);
    const fecha = { year: fechares.getFullYear(), month: fechares.getMonth() + 1, day: fechares.getDate() };
    const anio = fecha.year;
    const mes = (fecha.month < 10) ? "0" + fecha.month : fecha.month;
    const dia = (fecha.day < 10) ? "0" + fecha.day : fecha.day;
    var retorno: any = { dia: [], hora: [] };
    retorno.dia = anio + "-" + mes + "-" + dia;
    retorno.hora = fechares.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return retorno;
  }
  horaActual(hora: any) {
    console.log(hora)
    const [time, modifier] = hora.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10)
    if (modifier == "PM") {
      hours = hours + 12;
    }
    minutes = parseInt(minutes, 10);
    const salida = {
      hour: hours,
      minute: minutes
    }
    console.log(salida);
    return salida;
  }
  hora(hora: any) {
    const [time, modifier] = hora.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }
  selectordehora(tiempo: any) {
    tiempo.hour
    tiempo.minute
    var hora = tiempo.hour;
    var minutos = tiempo.minute;
    if (tiempo.hour === 0) {
      hora = "00";
    }
    if (tiempo.hour > 0 && tiempo.hour < 10) {
      hora = "0" + tiempo.hour;
    }
    if (tiempo.minute == 0) {
      minutos = "00";
    }
    return `${hora}:${minutos}`;
  }
}
