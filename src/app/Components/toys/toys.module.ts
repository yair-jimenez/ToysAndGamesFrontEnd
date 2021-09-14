import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToysComponent } from './toys.component';
import { GridComponent } from './grid/grid.component';
import { FormComponent } from './form/form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ToysComponent,
    GridComponent,
    FormComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    ToysComponent
  ]
})
export class ToysModule { }
