import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.less']
})
export class PedidosComponent {

}
