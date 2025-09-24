import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})

export class KeyCloakService {
    private keycloak = inject(Keycloak)
    constructor(){

    }

    logOut(){
        this.keycloak.logout();
    }

    getToken(): string | undefined {
        return this.keycloak.token;
    }

    async getUserProfile(){
        return await this.keycloak.loadUserProfile();
    }
}
