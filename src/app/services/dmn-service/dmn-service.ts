import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    DMNCreateInterface,
    DMNCreateVersionInterface,
    DMNDetailInterface, DMNFileInterface,
    DMNInterface,
    DMNListInterface
} from '../../interfaces/dmn-interface';
import { new_dmn } from '../../new_dmn';

@Injectable({
  providedIn: 'root'
})

export class DMNService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    // DMN
    createDMN(data: DMNCreateInterface): Observable<DMNCreateInterface> {
        return this.http.post<DMNCreateInterface>(`${this.baseUrl}/dmn`, data,  {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    getDMNs(): Observable<DMNListInterface> {
        return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn`);
    }

    getDMNsByDomain(domain: number): Observable<DMNListInterface> {
        return this.http.get<DMNListInterface>(`${this.baseUrl}/dmn?domain=${domain}`);
    }

    getDMN(id: number, version?: number): Observable<DMNDetailInterface> {
        if (version && !isNaN(version)){
            return this.http.get<DMNDetailInterface>(`${this.baseUrl}/dmn/${id}/${version}`);
        } else {
            return this.http.get<DMNDetailInterface>(`${this.baseUrl}/dmn/`);
        }
    }

    getDMNVersions(id: number): Observable<number[]> {
        return this.http.get<number[]>(`${this.baseUrl}/dmn/${id}/versions`);
    }

    createDMNVersion(data: DMNCreateVersionInterface): Observable<DMNCreateVersionInterface> {
        return this.http.post<DMNCreateVersionInterface>(`${this.baseUrl}/dmn/${data.dmn_id}/`, data, {
            headers: { 'Content-Type': 'application/json' }
        });

    }

    // DMN FILE
    getDMNFile(id: number, version: number): Observable<DMNFileInterface> {
        return this.http.get<DMNFileInterface>(`${this.baseUrl}/dmn/${id}/${version}/file`);
    }

    saveDMNFile(id: number, version: number, request: DMNFileInterface): Observable<DMNFileInterface> {
        return this.http.put<DMNFileInterface>(`${this.baseUrl}/dmn/${id}/${version}/file`, request);
    }

    createDMNFile(id: number, version: number, content: string): Observable<string> {
        return this.http.post<string>(`${this.baseUrl}/dmn/${id}/${version}/file`, {content});
    }

    updateDMNFile(id: number, version: number, content: string): Observable<string> {
        return this.http.put<string>(`${this.baseUrl}/dmn/${id}/${version}/file`, {content});
    }

    // DOMAIN
    getDomains(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/dmn/domains`);
    }

    getUsername(token: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}
