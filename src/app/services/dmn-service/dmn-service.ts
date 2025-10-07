import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    DMNCreateInterface,
    DMNCreateVersionInterface,
    DMNDetailInterface, DMNDomainInterface, DMNFileInterface,
    DMNInterface,
    DMNListInterface, DMNUpdateFileInterface
} from '../../interfaces/dmn-interface';
import { new_dmn } from '../../new_dmn';
import { KeycloakService } from '../keycloak-service/keycloak-service';


@Injectable({
  providedIn: 'root'
})

export class DMNService {
    private baseUrl = 'http://localhost:8080';
    private token: string | undefined = '';

    constructor(
        private http: HttpClient,
        private keycloak: KeycloakService
    ) {
        this.token = this.keycloak.getToken();
    }

    createDMN(data: DMNCreateInterface): Observable<DMNCreateInterface> {
        return this.http.post<DMNCreateInterface>(`${this.baseUrl}/dmns`, data,  {
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

    // NOW MANAGED BY FRONTEND
    // getDMNsByDomain(domain: number): Observable<DMNListInterface> {
    //     return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn?domain=${domain}`, {
    //         headers: {
    //             'Authorization': `Bearer ${this.token}`
    //         }
    //     });
    // }

    getDMN(id: number): Observable<DMNDetailInterface> {
        return this.http.get<DMNDetailInterface>(`${this.baseUrl}/dmn/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    createDMNVersion(data: DMNCreateVersionInterface): Observable<DMNCreateVersionInterface> {
        return this.http.post<DMNCreateVersionInterface>(`${this.baseUrl}/dmns/${data.dmnId}/`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // DMN FILE
    getDMNFile(id: number, version: number): Observable<DMNFileInterface> {
        return this.http.get<DMNFileInterface>(`${this.baseUrl}/dmns/${id}/${version}/file`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    saveDMNFile(id: number, version: number, request: DMNUpdateFileInterface): Observable<DMNFileInterface> {
        return this.http.put<DMNFileInterface>(`${this.baseUrl}/dmns/${id}/${version}/file`, request, {
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
