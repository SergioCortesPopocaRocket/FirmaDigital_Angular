import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  menu: MenuItem[] = [];
  model: any[] = [];


  // variable para mobile
  isMobile: boolean = false;

  constructor() {}

  ngOnInit(): void {


      this.model = [
          {
              label: 'Home',
              icon: 'pi pi-home',

              url: '/',
          },
      ];
  }


}
