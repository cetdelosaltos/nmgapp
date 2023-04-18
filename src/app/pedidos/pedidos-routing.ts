import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ProductosComponent } from './productos/productos.component';
import { ImportarComponent } from './productos/importar/importar.component';
import { PrincipalComponent } from './compradores/principal/principal.component';
import { CrearComponent } from './compradores/crear/crear.component';
const delogueado = () => redirectUnauthorizedTo(['/login']);
export const pedidosRutas: Routes = [
  { path: '', loadChildren: () => import('./reservaciones/reservaciones-routing').then(p => p.reseRutas) },

  {
    path: 'compradores',
    component: PrincipalComponent,
    ...canActivate(delogueado)
  },
  {
    path: 'productos',
    children: [
      {
        path: '',
        component: ProductosComponent
      },
      {
        path: 'importar',
        component: ImportarComponent
      }
    ]
  }
];
