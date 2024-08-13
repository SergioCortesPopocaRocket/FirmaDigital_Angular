
import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, Observable } from 'rxjs';
import { AppTopBarComponent } from './app.topbar.component';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html'
})
export class AppLayoutComponent implements  OnDestroy {

    menuOutsideClickListener: any;

    menuScrollListener: any;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;
    constructor( public renderer: Renderer2, public router: Router) {



    }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }



}
