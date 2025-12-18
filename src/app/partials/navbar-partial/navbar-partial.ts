import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import Keycloak, {KeycloakProfile} from 'keycloak-js';
import {KeycloakService} from '../../services/keycloak-service/keycloak-service';
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

export class NavbarPartial implements OnInit {
    userProfile: KeycloakProfile = {};

    constructor(
        private keycloakService: KeycloakService,
        private router: Router
    ) {
    }

    private readonly keycloak = inject(Keycloak);

    async ngOnInit() {
        await this.loadUserProfile()
    }

    onClickLogout() {
        this.keycloak.logout().then(r => this.router.navigate(['/']));
    }

    async loadUserProfile(): Promise<void> {
        try {
            this.userProfile = await this.keycloakService.getUserProfile();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
}
