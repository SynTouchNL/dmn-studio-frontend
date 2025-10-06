import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    DMNCreateInterface,
    DMNCreateVersionInterface,
    DMNDetailInterface, DMNDomainInterface, DMNFileInterface,
    DMNInterface,
    DMNListInterface
} from '../../interfaces/dmn-interface';
import { new_dmn } from '../../new_dmn';
import { KeycloakService } from '../keycloak-service/keycloak-service';


@Injectable({
  providedIn: 'root'
})

export class DMNService {
    private baseUrl = 'http://localhost:8080';
    token: string | undefined = '';

    constructor(
        private http: HttpClient,
        private keycloak: KeycloakService
    ) {
        this.token = this.keycloak.getToken();
    }

    // DMN // TODO PORT
    createDMN(data: DMNCreateInterface): Observable<DMNCreateInterface> {
        return this.http.post<DMNCreateInterface>(`${this.baseUrl}/dmn`, data,  {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    getDMNs(): Observable<DMNListInterface> {
        return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    getDMNsByDomain(domain: number): Observable<DMNListInterface> {
        return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn?domain=${domain}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    getDMN(id: number): Observable<DMNDetailInterface> {
        return this.http.get<DMNDetailInterface>(`${this.baseUrl}/dmn/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // TODO PORT
    createDMNVersion(data: DMNCreateVersionInterface): Observable<DMNCreateVersionInterface> {
        return this.http.post<DMNCreateVersionInterface>(`${this.baseUrl}/dmn/${data.dmn_id}/`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // DMN FILE
    getDMNFile(id: number, version: number): Observable<DMNFileInterface> {
        return this.http.get<DMNFileInterface>(`${this.baseUrl}/dmn/${id}/${version}/file`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // TODO PORT
    saveDMNFile(id: number, version: number, request: {
        id: number;
        version: number;
        file: string
    }): Observable<DMNFileInterface> {
        return this.http.put<DMNFileInterface>(`${this.baseUrl}/dmn/${id}/${version}/file`, request, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // TODO PORT
    createDMNFile(id: number, version: number, content: string): Observable<string> {
        return this.http.post<string>(`${this.baseUrl}/dmn/${id}/${version}/file`, { content }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // TODO PORT
    updateDMNFile(id: number, version: number, content: string): Observable<string> {
        return this.http.put<string>(`${this.baseUrl}/dmn/${id}/${version}/file`, { content }, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // DOMAIN
    getDomains(): Observable<DMNDomainInterface> {
        return this.http.get<DMNDomainInterface>(`${this.baseUrl}/domain`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }
}
