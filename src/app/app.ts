import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarPartial } from './partials/navbar-partial/navbar-partial'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertPartial } from './partials/alert-partial/alert-partial';
import { KeyCloakService } from './services/keycloak-service/key-cloak-service';

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
    user: any = [];
    constructor(
        private keycloakService: KeyCloakService
    ){
        this.user = this.keycloakService.getUserProfile();
    }

    ngOnInit() {
        console.log(this.user);
    }

}
