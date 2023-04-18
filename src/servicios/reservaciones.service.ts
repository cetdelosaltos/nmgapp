import { Injectable } from '@angular/core';
import { Database, onValue, query, ref } from '@angular/fire/database';
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  reservaciones: any = [];
  constructor(
    private db: Database,
    private fs: Firestore
  ) { }

  traerHome(reservas: any) {

    var retorno: any = [];
    var llevador: any = { id: reservas.id, comprador: [], reservas: [], fecha: reservas.fecha, locacion: reservas.locacion, estatus: reservas.estatus };
    this.meterComprador(reservas.comprador).then(com => {
      llevador.comprador = com;
    })
    this.meterDatos(reservas.reservas).then(prd => {
      llevador.reservas = prd;
    })

    return llevador;
  }
  async meterComprador(comri: any) {
    const compri = await getDoc(doc(this.fs, `clientes/${comri}`));
    const compra = compri.data();
    return compra;
  }
  async meterDatos(element: any) {
    var reservas: any = [];
    element.map(async (element: any) => {
      let rese: any = [];
      var resa = await getDoc(doc(this.fs, `productos/${element.producto}`));
      rese = {
        id: element.producto,
        cantidad: element.cantidad,
        observacion: element.observacion,
        producto: resa.data(),
      }
      reservas.push(rese);
    });
    return reservas;
  }
  borrarReservacion(borrado: any) {
    return deleteDoc(doc(this.fs, `reservaciones/${borrado}`));
  }
  async entregarReservacion(llave: any, entrega: any) {
    return setDoc(doc(this.fs, `reservaciones/${llave}`), entrega);
  }
  reactivarReservacion(llave: any) {
    return setDoc(doc(this.fs, `reservaciones/${llave}`), { estatus: 'activo' });
  }

  async traerReservaciones() {
    this.reservaciones = [];
    const reservas = await getDocs(collection(this.fs, 'reservaciones'));
    reservas.forEach((res) => {
      var datos: any = [];
      datos = res.data();
      datos.id = res.id;
      this.reservaciones.push(datos);
    })
    return this.reservaciones;
  }
}
