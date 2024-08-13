import { SignatureRoutingModule } from './signature-routing.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignatureComponent } from './signature.component';


@NgModule({
  declarations: [SignatureComponent],
  imports: [FormsModule, ReactiveFormsModule,SignatureRoutingModule],
})
export class SignatureModule {}
