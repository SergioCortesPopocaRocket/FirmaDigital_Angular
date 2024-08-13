import { PrimeNGConfig } from 'primeng/api';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
    }
}
