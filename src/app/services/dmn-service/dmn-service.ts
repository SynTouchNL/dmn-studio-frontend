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
import {DeploymentsInterface} from '../../interfaces/deployments-interface';


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

    // GET
    getDMNs(): Observable<DMNListInterface> {
        return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn`, {
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

    getDMNFile(id: number, version: number): Observable<DMNFileInterface> {
        return this.http.get<DMNFileInterface>(`${this.baseUrl}/dmns/${id}/${version}/file`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    getDomains(): Observable<DMNDomainInterface> {
        return this.http.get<DMNDomainInterface>(`${this.baseUrl}/domain`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    getDeployments(): Observable<DeploymentsInterface> {
        return this.http.get<DeploymentsInterface>(`${this.baseUrl}/deployments`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    // POST
    createDMN(data: DMNCreateInterface): Observable<DMNCreateInterface> {
        return this.http.post<DMNCreateInterface>(`${this.baseUrl}/dmns`, data,  {
            headers: {
                'Content-Type': 'application/json',
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

    // PUT
    saveDMNFile(id: number, version: number, request: DMNUpdateFileInterface): Observable<DMNFileInterface> {
        return this.http.put<DMNFileInterface>(`${this.baseUrl}/dmns/${id}/${version}/file`, request, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    updateVersion(id: number, version: number, status: number, updatedBy: string): Observable<any> {
        const body = {
            status: status,
            modifiedBy: updatedBy
        };
        return this.http.put<any>(`${this.baseUrl}/dmns/${id}/${version}`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

}
