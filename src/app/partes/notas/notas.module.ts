import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotasComponent } from './notas.component';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
    NotasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    NgbModalModule,
    QuillModule
  ],
  exports: [
    NotasComponent
  ]
})
export class NotasModule { }
