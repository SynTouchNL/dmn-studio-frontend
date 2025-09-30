import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Keycloak from 'keycloak-js';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';
import {
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle
} from '@ng-bootstrap/ng-bootstrap';

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

export class NavbarPartial implements OnInit {
    userprofile: any;

    constructor(private keycloakService: KeycloakService) {
    }

    private readonly keycloak = inject(Keycloak);

    async ngOnInit() {
        this.userprofile = await this.loadUserProfile();
    }

    onClickLogout() {
        this.keycloak.logout();
    }

    loadUserProfile() {
        return this.keycloakService.getUserProfile();
    }
}
