import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { MensajeriaService } from 'src/servicios/mensajeria.service';
import { EncabezadoComponent } from './partes/encabezado/encabezado.component';
import { FooterComponent } from './partes/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
  imports: [NgSwitch, NgSwitchDefault, NgSwitchCase, RouterOutlet, EncabezadoComponent, FooterComponent],
})
export class AppComponent {
  title = 'reservas';
  constructor(
    private msms: MensajeriaService
  ) { }
  ngOnInit() {
  }
}
