import { inject, Injectable } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { UserInterface } from '../../interfaces/user-interface';

@Injectable({
    providedIn: 'root'
})

export class KeycloakService {
    private keycloak = inject(Keycloak)

    updateToken(): Promise<boolean> { return this.keycloak.updateToken(60); }
    logout(): void { this.keycloak.logout().then(); }
    getToken(): string | undefined { return this.keycloak?.token; }
    hasAnyRole(roles: readonly string[]): boolean {
        return !!this.keycloak.authenticated && roles.some(role => this.keycloak.hasRealmRole(role));
    }
    async getUserProfile(): Promise<KeycloakProfile>{ return await this.keycloak.loadUserProfile(); }

    getCurrentUser(): Partial<UserInterface> {
        const t = this.keycloak.tokenParsed;
        return {
            id: t?.['sub'],
            username: t?.['preferred_username'],
            firstName: t?.['given_name'],
            lastName: t?.['family_name'],
            email: t?.['email']
        };
    }
}
