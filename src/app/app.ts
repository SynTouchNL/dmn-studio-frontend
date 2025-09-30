import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarPartial } from './partials/navbar-partial/navbar-partial'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertPartial } from './partials/alert-partial/alert-partial';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        NavbarPartial,
        NgbModule,
        AlertPartial
    ],
    templateUrl: './app.html',
    styleUrl: './app.css'
})

export class App {
    protected readonly title = signal('dmn-tool-frontend');
    constructor(){ }
}
