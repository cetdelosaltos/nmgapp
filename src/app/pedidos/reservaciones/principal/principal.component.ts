import { Component } from '@angular/core';
import { Subscription, fromEvent, map, merge, of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ReservacionesService } from 'src/servicios/reservaciones.service';
import { VerComponent } from '../ver/ver.component';
import { ConvertirFechasService } from 'src/servicios/ConvertirFechas.service';
import { NgbCalendar, NgbDateStruct, NgbDatepickerModule, NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PrecargadorComponent } from "../../../partes/precargador/precargador.component";
@Component({
  selector: 'app-principal',
  standalone: true,
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.less'],
  providers: [NgbModule],
  imports: [CommonModule, NgbDatepickerModule, NgbModalModule, RouterModule, PrecargadorComponent]
})
export class PrincipalComponent {
  cargando: boolean = true;
  crudo: any = [];
  hoy: any;
  reservas: any = [];
  estatusConexion: boolean = false;
  estatusConexion$: Subscription = Subscription.EMPTY;
  date: { year: number; month: number; } | undefined;
  locacion: any = "Tienda Física";
  todasReservas: any = [];
  contadorReloj: any;
  reloj: any;
  constructor(
    public app: ReservacionesService,
    private modal: NgbModal,
    public ruta: Router,
    private calendar: NgbCalendar,
    private fechas: ConvertirFechasService
  ) { }
  ngOnInit(): void {
    this.hoy = this.traerHoy();
    this.contadorReloj = setInterval(() => {
      this.reloj = new Date();
    }, 1000);

    this.iniciarHome();
  }
  ngOnDestroy(): void {
    clearInterval(this.contadorReloj);
  }
  eshoy(fecha: any) {
    var diita = this.convertirFecha(fecha);
    if (diita == this.hoy) {
      return true;
    } else {
      return false;
    }
  }
  traerHoy() {
    var elhoy = this.calendar.getToday();
    var hoyconv = this.convertirFecha(elhoy);
    this.hoy = hoyconv;
    return hoyconv;
  }
  convertirFecha(fecha: any) {

    const anio = fecha.year;
    const mes = (fecha.month < 10) ? "0" + fecha.month : fecha.month;
    const dia = (fecha.day < 10) ? "0" + fecha.day : fecha.day;
    var eldia = anio + "-" + mes + "-" + dia;
    return eldia;
  }

  iniciarHome() {
    this.todasReservas = [];
    var reservaciones = this.app.traerReservaciones();
    reservaciones.then(resi => {
      resi.forEach((data: any) => {
        var trae = this.app.traerHome(data);
        this.todasReservas.push(trae);
        this.traerReservas(this.hoy);
        this.cargando = false;
      });
    })
  }
  traerReservas(eve: any) {
    let pedidos: any = [];
    this.todasReservas?.forEach((element: any) => {
      const fechacomp = this.fechas.fecha(element.fecha);
      let fechaobj: any = [];
      if (typeof (eve) == 'object') {
        fechaobj = this.convertirFecha(eve);
      } else {
        fechaobj = eve;
      }
      console.log('fechas', fechaobj, fechacomp.dia);
      if (fechaobj == fechacomp.dia) {
        pedidos.push(element)
      }
    });
    console.log(pedidos);
    this.reservas = pedidos;
  }
  verReserva(reserva: any) {

    var emergente = this.modal.open(VerComponent);
    emergente.componentInstance.reservacion = reserva;
    emergente.componentInstance.conexion = this.verificarConexion();
  }
  verificarConexion() {
    this.estatusConexion = navigator.onLine;
    this.estatusConexion$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.estatusConexion = status;
      });
    return this.estatusConexion;
  }
  tienePedido(fecha: NgbDateStruct) {
    if (this.todasReservas.length > 0) {
      var diita = this.convertirFecha(fecha);
      var retorno: boolean = false;
      for (var i = 0; i < this.todasReservas.length; i++) {
        var fechares = this.fechas.fecha(this.todasReservas[i].fecha);
        var fechacomp = fechares.dia;
        if (fechacomp == diita) {
          retorno = true;
        }
      }
      return retorno;
    } else {
      return false;
    }
  }
}
