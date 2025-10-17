import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DMNCreateInterface, DMNCreateVersionInterface, DMNDetailInterface, DMNDomainInterface, DMNFileInterface, DMNListInterface, DMNUpdateFileInterface } from '../../interfaces/dmn-interface';
import { KeycloakService } from '../keycloak-service/keycloak-service';
import { DeploymentsInterface } from '../../interfaces/deployments-interface';
import { EnvironmentsInterface } from '../../interfaces/environments-interface';

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
    /**
     * Get all DMNs.
     * @returns DMNListInterface of all DMNs.
     * @internal
     */
    getDMNs(): Observable<DMNListInterface> {
        return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get specific DMNs.
     * @param id ID of the DMN to get.
     * @returns DMNtInterface of DMN matching the id.
     * @internal
     */
    getDMN(id: number): Observable<DMNDetailInterface> {
        return this.http.get<DMNDetailInterface>(`${this.baseUrl}/dmn/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get DMN version's file content.
     * @param id
     * @param version
     * @returns DMNFileInterface with metadata of file and DMN/version.
     * @internal
     */
    getDMNFile(id: number, version: number): Observable<DMNFileInterface> {
        return this.http.get<DMNFileInterface>(`${this.baseUrl}/dmns/${id}/${version}/file`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get all domains.
     * @returns List of domains.
     * @internal
     */
    getDomains(): Observable<DMNDomainInterface> {
        return this.http.get<DMNDomainInterface>(`${this.baseUrl}/domain`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get all deployments.
     * @returns DeploymentsInterface with deployments.
     * @internal
     */
    getDeployments(): Observable<DeploymentsInterface> {
        return this.http.get<DeploymentsInterface>(`${this.baseUrl}/deployments`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get all environments.
     * @returns EnvironmentsInterface with environments.
     * @internal
     */
    getEnvironments(): Observable<EnvironmentsInterface>{
        return this.http.get<any>(`${this.baseUrl}/environment`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })
    }

    /**
     * Create a new DMN.
     * @param data - DMNCreateInterface with data for new DMN
     * @returns Observable with created DMNCreateInterface
     * @internal
     */
    createDMN(data: DMNCreateInterface): Observable<DMNCreateInterface> {
        return this.http.post<DMNCreateInterface>(`${this.baseUrl}/dmns`, data,  {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Create a new DMN version.
     * @param data - DMNCreateVersionInterface with data for new DMN version
     * @returns Observable with created DMNCreateVersionInterface
     * @internal
     */
    createDMNVersion(data: DMNCreateVersionInterface): Observable<DMNCreateVersionInterface> {
        return this.http.post<DMNCreateVersionInterface>(`${this.baseUrl}/dmns/${data.dmnId}/`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Save DMN file for specific DMN version.
     * @param id - DMN ID
     * @param version - Version number DMN
     * @param request - DMNUpdateFileInterface with file data
     * @returns Observable with DMNFileInterface result
     * @internal
     */
    saveDMNFile(id: number, version: number, request: DMNUpdateFileInterface): Observable<DMNFileInterface> {
        return this.http.put<DMNFileInterface>(`${this.baseUrl}/dmns/${id}/${version}/file`, request, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Update version status.
     * @param id - The DMN ID
     * @param version - DMN version number
     * @param status - New status to set
     * @param updatedBy - User who is updating the version
     * @returns Observable with the update result
     * @internal
     */
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
