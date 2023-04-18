import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Cliente } from 'src/interfaces/Cliente';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-ver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.less']
})
export class VerComponent {
  planillaComprador: any;
  mensaje: string = 'Llene los Campos';
  quehacer: string = 'actualizar';
  comprador: any;
  regreso: any;
  constructor(
    private fb: UntypedFormBuilder,
    public modoAct: NgbActiveModal,
    private db: Firestore

  ) {

  }
  ngOnInit(): void {
    if (this.quehacer == 'actualizar') {
      this.planillaComprador = this.fb.group({
        id: [this.comprador.id, Validators.required],
        nombre: [this.comprador.nombre, Validators.required],
        telefono: [this.comprador.telefono, Validators.required],
        correo: [this.comprador.correo]
      })
    } else {
      this.planillaComprador = this.fb.group({
        nombre: ['', Validators.required],
        telefono: ['', Validators.required],
        correo: ['']
      });
    }
  }

  actualizarComprador() {
    const compradorNuevo: Cliente = this.planillaComprador.value;
    if (this.planillaComprador.valid) {
      const datos = {
        id: compradorNuevo.id,
        nombre: compradorNuevo.nombre,
        correo: compradorNuevo.correo,
        telefono: compradorNuevo.telefono
      }
      setDoc(doc(this.db, 'clientes/' + compradorNuevo.id), datos).then(() => {
        this.modoAct.close();
      })
    } else {
      this.mensaje = "Revise sus Datos";
    }
  }
  meterComprador() {
    const compradorNuevo: Cliente = this.planillaComprador.value;
    console.log(compradorNuevo);
    if (this.planillaComprador.valid) {
      const datos = {
        nombre: compradorNuevo.nombre,
        correo: compradorNuevo.correo,
        telefono: compradorNuevo.telefono
      }
      addDoc(collection(this.db, 'clientes'), datos).then(() => {
        this.modoAct.close();
      })
    } else {
      this.mensaje = "Revise sus Datos";
    }
  }

  borrarPlanilla() {
    this.planillaComprador.reset();
  }
  /* registrarComprador() {
    if (this.planillaComprador.valid) {
      this.cliente = this.db.list('tienda/clientes');
      this.cliente.push(this.planillaComprador.value).then(() => {
        this.modoAct.close('exito');
      }
      ).catch((err: any) => {
        console.log(err);
      })

    } else {
      this.mensaje = "Revise sus Datos";
    }
  } */
  cerrarCrearComprador() {
    this.modoAct.close();
  }
  regresar() {
    this.modoAct.close(this.regreso)
  }

}
