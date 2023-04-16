import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

const delogueado = () => redirectUnauthorizedTo(['/login']);
export const caminos: Routes = [
  {
    path: '',
    loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent),
    ...canActivate(delogueado)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent),
    ...canActivate(delogueado)
  },
  {
    path: 'login',
    loadComponent: () => import('./logueo/logueo.component').then(m => m.LogueoComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(caminos)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
