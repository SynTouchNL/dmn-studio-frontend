import { inject, Injectable } from '@angular/core';
import Keycloak, {KeycloakProfile} from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})

export class KeycloakService {
    private keycloak = inject(Keycloak)
    constructor() {}

    updateToken(): Promise<boolean> {
        return this.keycloak.updateToken(60)
    }

    logout(): void {
        this.keycloak.logout().then();
    }

    getToken(): string | undefined {
        return this.keycloak?.token;
    }

    async getUserProfile(): Promise<KeycloakProfile>{
        return await this.keycloak.loadUserProfile();
    }
}
