import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Logueo } from 'src/interfaces/logueo';
import { MensajeriaService } from 'src/servicios/mensajeria.service';

@Component({
  selector: 'app-logueo',
  standalone: true,
  templateUrl: './logueo.component.html',
  styleUrls: ['./logueo.component.css'],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class LogueoComponent implements OnInit {
  mensaje: string = 'Ingrese sus Datos';
  planillaLog: any;
  logueando: boolean = false;
  fieldTextType: boolean = false;
  notitoque: any = "";
  constructor(
    private fb: FormBuilder,
    public rsvauth: Auth, // Inject Firebase auth service
    private db: Firestore,
    public ruta: Router,
    private msm: MensajeriaService
  ) { }

  ngOnInit(): void {
    this.planillaLog = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
    });
    signOut(this.rsvauth).then(() => {
    })
  }
  verificarPlanilla() {
    if (this.planillaLog.valid) {
      this.mensaje = "";
    } else {
      this.mensaje = "Verifique sus datos";
    }
  }
  iniciarSesion(plani: Logueo) {
    this.mensaje = '';
    this.logueando = true;
    signInWithEmailAndPassword(this.rsvauth, plani.correo, plani.contrasena).then(result => {
      this.msm.registrarTipo(plani.correo)
    }).then(() => {
      this.ruta.navigate(['/']);
    }).catch((error) => {

      this.logueando = false;
      console.error('conexiol', error);
      if (error.error == 'noexiste') {
        this.mensaje = 'Correo no registrado';
        console.log(this.mensaje);
      } else if (error.error === 'malacontra') {
        this.mensaje = 'Contraseña Incorrecta';
        console.log(this.mensaje);
      }
    }
    )

  }
  verContra() {
    this.fieldTextType = !this.fieldTextType;
  }

}
