import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WackupTimeEditComponent } from './wackup-time-edit/wackup-time-edit.component';
import { RadioComponent } from './radio/radio.component';
const routes: Routes = [
  { path: 'wackuptime/:id', component: WackupTimeEditComponent},
  { path: "", component: RadioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
