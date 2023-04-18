import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConvertirFechasService } from 'src/servicios/ConvertirFechas.service';
import { ReservacionesService } from 'src/servicios/reservaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver',
  standalone: true,
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.less'],
  providers: [],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class VerComponent {
  reservacion: any;
  conexion: boolean = false;
  cargaEntregar: boolean = false;
  cargaEliminar: boolean = false;
  fecha: any;
  hora: any;
  total: any;
  constructor(
    private modo: NgbActiveModal,
    public app: ReservacionesService,
    public fechaserv: ConvertirFechasService,
  ) {
  }
  ngOnInit(): void {
    this.fecha = this.fechaserv.fecha(this.reservacion.fecha);
    let cuenta: number = 0;
    this.reservacion.reservas.forEach((element: any) => {
      let llevo = element.cantidad * element.producto.precio;
      cuenta += llevo;
    })
    this.total = cuenta;
  }

  async entregarPedido(pedido: any) {
    console.log(pedido)
    this.cargaEntregar = true;
    const llave = pedido.id;
    const pasado = { estatus: 'entregado' }
    /*  this.app.entregarReservacion(llave, pasado).then(
       (resp: any) => {
         this.modo.close('entregado');
       }
     ) */
  }
  reactivarPedido(pedido: any) {
    this.cargaEntregar = true;
    this.app.reactivarReservacion(pedido.$key).then((res: any) => {
      this.modo.close('actualizar')
    })
  }

  eliminarReservacion(id: any) {
    Swal.fire({
      title: 'Eliminar Reservación',
      text: '¿Desea realmente eliminar esta reservación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar Definitivamente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#bb2d3b'
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.app.borrarReservacion(id.$key).then((res: any) => {
          Swal.fire('Reservación Eliminada', undefined, 'success').then((res: any) => {
            this.modo.close('actualizar')
          });
        })
      }
    })
  }
  cerramodo() {
    this.modo.close('actualizar')
  }
}
