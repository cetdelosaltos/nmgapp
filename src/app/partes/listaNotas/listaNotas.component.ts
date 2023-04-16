import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotasService } from 'src/app/servicios/notas.service';
import { Component, OnInit } from '@angular/core';
import { NotasComponent } from '../notas/notas.component';
import Swal from 'sweetalert2';
import { Notas } from '../notas/notas';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'lista-notas',
  templateUrl: './listaNotas.component.html',
  styleUrls: ['./listaNotas.component.css']
})
export class ListaNotasComponent implements OnInit {
  lasnotas: any;
  pasadas: any;
  notasCargadas: boolean = false;
  constructor(
    public notas: NotasService,
    public modal: NgbModal,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.NotasState();
    this.TraerLasNotas();
  }
  NotasState() {
    this.notas.traerNotas().valueChanges().subscribe((data: any) => {
      if (data.length >= 0) {
        this.notasCargadas = true;
      }
    })
  }
  TraerLasNotas() {
    this.notas.traerNotas().snapshotChanges().subscribe((data: any) => {
      this.lasnotas = [];
      this.pasadas = [];
      data.forEach((item: any) => {
        let a: any = item.payload.toJSON();
        a['$key'] = item.key;
        if (a.estatus == 'activa') {
          this.lasnotas.push(a as Notas);
        } else {
          this.pasadas.push(a as Notas);
        }
      })
    })
  }
  ingresarNotaModal() {
    const planilla = this.modal.open(NotasComponent);
    planilla.componentInstance.quehacer = 'ingresar';
    planilla.result.then((res: any) => {
      if (res == 'exito') {
        Swal.fire('Nota Creada Con Éxito', undefined, 'success').then(() => {
        })
      } else {

      }
    });
  }
  editarNota(not: any) {
    const planilla = this.modal.open(NotasComponent);
    planilla.componentInstance.quehacer = 'editar';
    planilla.componentInstance.notavieja = not;
    planilla.result.then((res: any) => {
      if (res == 'exito') {
        Swal.fire('Nota Actualizada Con Éxito', undefined, 'success').then(() => {
        })
      } else {

      }
    });
  }
  borrarNota(nota: Notas) {
    Swal.fire({
      title: '¿Borrar Esta Nota? No se puede deshacer',
      html: nota.nota,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        var notaborra = this.db.object('notas/' + nota.$key);
        notaborra.remove().then((res: any) => {
          Swal.fire('Nota borrada con éxito', undefined, 'success').then((res: any) => {
            Swal.close();
          })
        }
        ).catch((err) => {
          Swal.fire('Hubo un Problema', 'La nota no pudo ser borrada', 'error');
        })
      }
    })
  }
  marcarListo(nota: Notas) {
    console.log(nota.$key);
    const llave = nota.$key;
    var actual = {
      nota: nota.nota,
      estatus: 'pasado'
    };
    var notaborra = this.db.object('notas/' + llave);
    notaborra.update(actual);
  }
}
