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
    path: 'pedidos',
    loadChildren: () =>
      import('./pedidos/pedidos-routing')
        .then(m => m.pedidosRutas),
    ...canActivate(delogueado)
  },
  {
    path: 'login',
    loadComponent: () => import('./logueo/logueo.component').then(m => m.LogueoComponent)
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  },
  /*   {
      path: 'migrar',
      loadComponent: () => import('./migracion/migracion.component').then(m => m.MigracionComponent),
      ...canActivate(delogueado)
    }, */
];

@NgModule({
  imports: [RouterModule.forRoot(caminos)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
