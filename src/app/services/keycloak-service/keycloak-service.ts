import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config-service/config-service';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})

export class KeycloakService {
    private keycloak = inject(Keycloak)
    private baseUrl = "";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.baseUrl = this.configService.getConfig().keycloak.url;
    }

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
