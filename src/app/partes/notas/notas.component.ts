import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, NgZone, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Notas } from './notas';
import { MensajesService } from 'src/app/servicios/mensajes.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotasComponent {
  lasnotas: any;
  quehacer: string = 'ingresar';
  planillaNota: any;
  mensaje: string = "";
  notavieja: any;
  constructor(
    private modo: NgbActiveModal,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private mens: MensajesService,
  ) { }
  ngOnInit(): void {
    this.planillaNota = this.fb.group({
      $key: '',
      nota: ['', Validators.required]
    })
    if (this.quehacer == 'editar') {
      this.planillaNota.setValue({ $key: this.notavieja.$key, nota: this.notavieja.nota })
    }
  }
  cerrarCrearNota() {
    this.modo.close();
  }
  crearNota(nota: Notas) {
    this.db.list('notas').push({ nota: nota.nota, estatus: 'activa' }).then(() => {
      var paso = {
        titulo: 'Nueva Nota',
        cuerpo: nota.nota
      }
      // this.mens.enviarNota(paso);
      this.modo.close('exito');
    })
  }
  editarNota(nota: Notas) {
    this.db.object('notas/' + nota.$key).update({
      nota: nota.nota,
      estatus: 'activa'
    }).then(() => {
      this.modo.close('exito');
    })
  }
}