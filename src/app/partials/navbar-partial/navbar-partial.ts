import {Component, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Keycloak from 'keycloak-js';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar-partial',
    imports: [
        RouterLink,
        RouterLinkActive,
        NgbDropdownToggle,
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownItem
    ],
  templateUrl: './navbar-partial.html',
  styleUrl: './navbar-partial.css'
})
export class NavbarPartial {
    private readonly keycloak = inject(Keycloak);

    onClickLogout() {
        this.keycloak.logout();
    }
}
