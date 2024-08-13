import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit {
    @Input() minimal: boolean = false;

    componentThemes: any[] = [];

    scales: number[] = [12, 13, 14, 15, 16];

    constructor(


    ) {}

    ngOnInit() {
        this.componentThemes = [
            { name: 'indigo', lightColor: '#4C63B6', darkColor: '#6A7EC2' },
            { name: 'blue', lightColor: '#1992D4', darkColor: '#3BABE8' },
            { name: 'green', lightColor: '#27AB83', darkColor: '#44D4A9' },
            { name: 'deeppurple', lightColor: '#896FF4', darkColor: '#B1A0F8' },
            { name: 'orange', lightColor: '#DE911D', darkColor: '#E8AB4F' },
            { name: 'cyan', lightColor: '#00B9C6', darkColor: '#58CDD5' },
            { name: 'yellow', lightColor: '#F9C404', darkColor: '#FDDD68' },
            { name: 'pink', lightColor: '#C74B95', darkColor: '#D77FB4' },
            { name: 'purple', lightColor: '#BA6FF4', darkColor: '#D1A0F8' },
            { name: 'lime', lightColor: '#84BD20', darkColor: '#A3D44E' },
        ];
    }



    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }


}
