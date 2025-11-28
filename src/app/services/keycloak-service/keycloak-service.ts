import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class KeycloakService {
    private keycloak = inject(Keycloak)
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) {
    }

    updateToken(): Promise<boolean> {
        return this.keycloak.updateToken(60)
    }

    logout(): void {
        this.keycloak.logout().then(r =>
        console.log('Logged out', r));
    }

    getUsers(): any {
        return this.http.get(`${this.baseUrl}/auth/users`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });
    }

    getUserByGroup(groupId: string): any {
        return this.http.get(`${this.baseUrl}/auth/group-users/${groupId}`).subscribe(
            data => {
                return data
            }
        );
    }

    getToken(): string | undefined {
        return this.keycloak?.token;
    }

    async getUserProfile(){
        return await this.keycloak.loadUserProfile();
    }
}
