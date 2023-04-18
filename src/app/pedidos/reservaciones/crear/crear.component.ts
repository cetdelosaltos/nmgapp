import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Database, child, get, onValue, ref } from '@angular/fire/database';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction } from 'rxjs';
import { Cliente } from 'src/interfaces/Cliente';
import { Producto } from 'src/interfaces/Producto';
import { Reservaciones } from 'src/interfaces/Reservaciones';
import { ConvertirFechasService } from 'src/servicios/ConvertirFechas.service';
import { MensajeriaService } from 'src/servicios/mensajeria.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear',
  standalone: true,
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbTypeaheadModule,
    NgbTimepickerModule
  ]
})
export class CrearComponent {
  filtrado: any;
  mensaje: string = "Llena Todos los Campos";
  compradores: any;
  productos: any = [];
  formularioPedidos: any = [];
  planillaOtrosDatos: any = [];
  hoyes: any = new Date();
  cargado: boolean = false;
  reservacion: any;
  textoBoton: string = '';
  constructor(
    private fb: UntypedFormBuilder,
    private db: Database,
    private fs: Firestore,
    public ruta: Router,
    private fechas: ConvertirFechasService,
    private mens: MensajeriaService
  ) { }
  ngOnInit(): void {
    if (this.ruta.getCurrentNavigation()) {
    }
    this.reservacion = history.state.id ? history.state : undefined;
    const diahoy = ("0" + this.hoyes.getDate()).slice(-2);
    const meshoy = ("0" + (this.hoyes.getMonth() + 1)).slice(-2)
    const aniohoy = this.hoyes.getFullYear();
    const fechahoy = aniohoy + "-" + meshoy + "-" + diahoy;
    if (this.reservacion) {
      this.filtrado = this.reservacion.comprador;
      const fechita = this.fechas.fecha(this.reservacion.fecha);
      const horita = this.fechas.horaActual(fechita.hora);
      this.planillaOtrosDatos = this.fb.group({
        fecha_entrega: [fechita.dia, Validators.required],
        hora_entrega: [horita, Validators.required],
        locacion: [this.reservacion.locacion, Validators.required]
      });
      this.formularioPedidos.length = 0;
      console.log(this.reservacion.reservas);
      this.reservacion.reservas.forEach((element: any) => {
        this.formularioPedidos.push(
          this.fb.group({
            cantidad: [element.cantidad],
            producto: [element.producto, Validators.required],
            observacion: [element.observaciones ?? '']
          })
        );
      });
      this.textoBoton = 'actualizar';
    } else {
      this.planillaOtrosDatos = this.fb.group({
        fecha_entrega: [fechahoy, Validators.required],
        hora_entrega: ['', Validators.required],
        locacion: ['Tienda Física', Validators.required]
      })
      this.formularioPedidos = [
        this.fb.group({
          cantidad: [1],
          producto: [[], Validators.required],
          observacion: ['']
        })
      ];
      this.textoBoton = 'registro'
    }
    this.iniciarReservaciones();
    this.cargado = true;
  }

  async GetCompradoresFire() {
    this.compradores = [];
    const clientes = await getDocs(collection(this.fs, 'clientes'));
    clientes.forEach(element => {
      this.compradores.push(element.data());
    });

  }
  async GetProductosFire() {
    this.productos = [];
    const productos = await getDocs(collection(this.fs, 'productos'));
    productos.forEach(prod => {
      this.productos.push(prod.data() as Producto);
    })
  }

  iniciarReservaciones() {
    this.GetCompradoresFire();
    this.GetProductosFire();
  }
  agregarFila() {
    this.formularioPedidos.push(this.fb.group({
      cantidad: [1],
      producto: [[], Validators.required],
      observacion: ['']
    })
    )
  }
  borrarFila(toDelete: any) {
    let aux: any[] = [];
    for (let form of this.formularioPedidos) {
      if (toDelete !== form) {
        aux.push(form);
      }
    }
    this.formularioPedidos = aux;
  }
  formatComprador = (comprador: Cliente) => comprador.nombre + " - " + comprador.telefono;
  buscarComprador: OperatorFunction<string, readonly Cliente[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.compradores.filter((comprador: Cliente) =>
          new RegExp(term, 'mi')
            .test(comprador.nombre + comprador.telefono)
        )
          .slice(0, 10)
      )
    );
  formatoProd = (prodito: Producto) => prodito.nombre;

  buscarProductos: OperatorFunction<string, readonly Producto[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.productos.filter((producto: Producto) =>
          new RegExp(term, 'mi')
            .test(producto.nombre)
        )
          .slice(0, 10)
      )
    );

  validarPlanilla(planilla: any) {
    var esvalido: boolean = true;
    const validito = planilla.map((res: any) => {
      if (!res.valid) {
        return false;
      } else {
        return true;
      }
    }
    );
    if (validito.indexOf(false) > -1 || this.planillaOtrosDatos.valid == false) {
      esvalido = false;
    } else {
      esvalido = true;
    }
    return esvalido;
  }
  limpiarReservaciones(planilla: any) {
    var salid: any = [];
    planilla.map((res: any) => {
      var meter = {
        cantidad: res.value.cantidad,
        observacion: res.value.observacion,
        producto: res.value.producto.id
      }
      salid.push(meter);
    })
    return salid;
  }
  async hacerReservacion(planilla: any) {
    var siesvalido = this.validarPlanilla(planilla);
    if (siesvalido) {
      this.mensaje = "Procesando la Reservación.";
      Swal.fire({
        title: "Procesando la Reservación",
        showCancelButton: false,
        showConfirmButton: false,
      })
      const otrosdatos = this.planillaOtrosDatos.value;
      var hora = this.fechas.selectordehora(otrosdatos.hora_entrega);
      const FechaTotal = otrosdatos.fecha_entrega + "T" + hora;
      const fechautc = new Date(FechaTotal);
      console.log(FechaTotal, fechautc);
      const fechafinal = fechautc.getTime();
      var data: Reservaciones = {
        comprador: this.filtrado.id,
        reservas: this.limpiarReservaciones(planilla),
        locacion: otrosdatos.locacion,
        fecha: fechafinal,
        estatus: 'activo'
      };
      console.log(data);
      const reservas = collection(this.fs, 'reservaciones');
      await addDoc(reservas, data).then(() => {
        var paso = {
          titulo: 'Nueva Reservacion',
          cuerpo: 'Para el: ' + otrosdatos.fecha_entrega + ' ' + otrosdatos.hora_entrega,
        }
        this.mens.enviarNota(paso);
        Swal.close();
        this.ruta.navigate(['/'])
      });
    } else {
      this.mensaje = "Revise los Datos";
    }
  }
  actualizarReservacion(planilla: any) {
    var siesvalido = this.validarPlanilla(planilla);
    if (siesvalido) {
      this.mensaje = "Procesando la Reservación.";
      Swal.fire({
        title: "Procesando la Reservación",
        showCancelButton: false,
        showConfirmButton: false,
      })
      const otrosdatos = this.planillaOtrosDatos.value;
      var hora = this.fechas.selectordehora(otrosdatos.hora_entrega);
      const FechaTotal = otrosdatos.fecha_entrega + "T" + hora;
      const fechautc = new Date(FechaTotal);
      console.log(FechaTotal, fechautc);
      const fechafinal = fechautc.getTime();
      var data: Reservaciones = {
        comprador: this.filtrado.id,
        reservas: this.limpiarReservaciones(planilla),
        locacion: otrosdatos.locacion,
        fecha: fechafinal,
        estatus: 'activo'
      };
      const reservas = doc(this.fs, `reservaciones/${history.state.id}`);
      getDoc(reservas).then((tas) => {
        console.log(tas.data(), data);
        if (tas) {
          setDoc(reservas, data).then(() => {
            Swal.close();
            this.ruta.navigate(['/'])
          }).catch(() => {
            console.log("No data available");
          })
        }
      })

      /* const refres = ref(this.db);
      const reserva3s = get(child(refres, `reservaciones/${history.state.id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      }) */
      /*       reservas.update(data).then(() => {
            })
       */
    } else {
      this.mensaje = "Revise los Datos";
    }
  }
}
