import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { FormParentComponent } from './form-parent/form-parent.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    ReactiveFormComponent,
    FormParentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo:"/home", pathMatch: 'full' },
      { path: 'home', component: FormParentComponent, children: [
        { path:'', redirectTo:'/home/template', pathMatch: 'full'},
        { path: 'template', component: CustomerComponent },
        { path:'reactive', component: ReactiveFormComponent }
      ] },
    ]),
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
