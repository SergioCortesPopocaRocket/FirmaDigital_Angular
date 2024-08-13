import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignatureComponent } from './signature.component';

@NgModule({
  imports: [RouterModule.forChild([
    {path: '',data: {},component: SignatureComponent}
  ])],
  exports: [RouterModule]
})

export class SignatureRoutingModule {}
