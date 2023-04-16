import { PrecargadorComponent } from './precargador.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    PrecargadorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrecargadorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class PrecargadorModule { }
