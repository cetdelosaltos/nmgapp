import { VerComponent } from './../ver/ver.component';
import { CommonModule } from '@angular/common';
import { PrecargadorComponent } from "../../../partes/precargador/precargador.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompradoresService } from 'src/servicios/compradores.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from 'src/interfaces/Cliente';
import { Firestore, collection, collectionSnapshots } from '@angular/fire/firestore';
@Component({
  selector: 'app-principal',
  standalone: true,
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.less'],
  imports: [CommonModule, PrecargadorComponent, RouterModule]
})
export class PrincipalComponent {
  cargado: boolean = false;
  compradores: any;
  compraBorra: any;
  filtrados: any;
  compraid: any = 0;
  completado: boolean = false;
  constructor(
    private compra: CompradoresService,
    private modo: NgbModal,
    public comprador: ActivatedRoute,
    public ruta: Router,
    public ruteo: ActivatedRoute,
    private fs: Firestore
  ) {

  }
  ngOnInit(): void {
    this.compraid = (this.comprador.snapshot.paramMap.get('id')) ? this.comprador.snapshot.paramMap.get('id') : 0;
    this.GetCompradoresFire();
    this.escucharCompradores();
  }
  escucharCompradores() {
    return collectionSnapshots(collection(this.fs, 'clientes')).subscribe((element: any) => {
      this.GetCompradoresFire();
    })
  }
  GetCompradoresFire() {
    let s: any = this.compra.GetClientes();
    s.then((a: any) => {
      this.compradores = [];
      this.filtrados = [];
      a.forEach((item: any) => {
        let a: any = item;
        a['id'] = item.id;
        this.compradores.push(a as Cliente);
        this.filtrados.push(a as Cliente);
      })
      if (this.compraid != 0 && this.compraid != 'nuevo') {
        console.log(this.compradores)
        this.filtrados = Object.assign([], this.compradores).filter(
          (item: any) => {
            if (item.id == this.compraid) {
              return true;
            } else {
              return false;
            }
          }
        )
        console.log(this.filtrados)
      }
      if (this.compraid == 'nuevo') {
        this.ingresarCompradorModal();
      }
      this.cargado = true;
    })
  }

  filtrar(llegando: any) {
    this.filtrados = Object.assign([], this.compradores).filter(
      (item: any) => {
        var haynombre = item.nombre.toLowerCase().indexOf(llegando.toLowerCase()) > -1;
        var haycorreo = (item?.correo?.toLowerCase().indexOf(llegando.toLowerCase()) > -1) ? item.correo.toLowerCase().indexOf(llegando.toLowerCase()) > -1 : false;
        var haytelefono = item.telefono.toLowerCase().indexOf(llegando.toLowerCase()) > -1;
        if (haycorreo || haynombre || haytelefono) {
          return true;
        } else {
          return false;
        }
      }
    )
  }
  borrarCompradorModal(comprador: any) {
    this.compraBorra = comprador;
    Swal.fire({
      title: 'Realmente desea borrar a \r' + comprador.nombre,
      text: 'También se borrarán sus reservaciones y todos los datos asociados',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar Definitivamente'
    }).then((res: any) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: 'Borrando a:' + comprador.nombre,
          text: 'Un momento por favor',
          icon: 'info',
          showCancelButton: false,
          showConfirmButton: false
        })
        this.compra.eliminarComprador(comprador).then(() => {
          Swal.close();
        })
      }
    })
  }
  actualizarCompradorModal(comprador: any) {
    const planilla = this.modo.open(VerComponent);
    planilla.componentInstance.comprador = comprador;
    planilla.componentInstance.quehacer = 'actualizar';
    planilla.result.then((res: any) => {
      if (res == 'exito') {
      } else {

      }
    });
    planilla.closed.subscribe(() => {
    })
    planilla.dismissed.subscribe(() => {
    })
  }
  ingresarCompradorModal() {
    this.compraid = ""

    const planilla = this.modo.open(VerComponent);
    planilla.componentInstance.quehacer = 'ingresar';
    planilla.result.then((res: any) => {
      if (res == 'exito') {

      } else {

      }
    });
    planilla.closed.subscribe(() => {

    })
    planilla.dismissed.subscribe(() => {


    })
  }
}
