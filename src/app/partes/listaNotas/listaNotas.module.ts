import { NotasModule } from './../notas/notas.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaNotasComponent } from './listaNotas.component';
import { PrecargadorModule } from "../precargador/precargador.module";
import { SafePipeModule } from 'safe-pipe';

@NgModule({
  declarations: [ListaNotasComponent],
  exports: [
    ListaNotasComponent
  ],
  imports: [
    CommonModule,
    SafePipeModule,
    NotasModule,
    PrecargadorModule,
  ]
})
export class ListaNotasModule { }
