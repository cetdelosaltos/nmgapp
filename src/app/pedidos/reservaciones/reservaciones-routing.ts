import { Routes } from "@angular/router";
import { PrincipalComponent } from "./principal/principal.component";

export const reseRutas: Routes = [
  {
    path: 'reservaciones',
    component: PrincipalComponent,
  },
  {
    path: 'crear',
    loadComponent: () => import('./crear/crear.component').then(c => c.CrearComponent)
  },
  {
    path: 'actualizar/:id',
    loadComponent: () => import('./crear/crear.component').then(c => c.CrearComponent)
  }
]
