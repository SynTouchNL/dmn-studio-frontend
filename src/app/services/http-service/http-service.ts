import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    DMNCreateInterface, DMNCreateVersionInterface, DMNDomainInterface, DMNFileInterface,
    DMNInterface, DMNListInterface, DMNUpdateFileInterface
} from '../../interfaces/dmn-interface';
import { KeycloakService } from '../keycloak-service/keycloak-service';
import { DeploymentsInterface } from '../../interfaces/deployments-interface';
import { EnvironmentsInterface } from '../../interfaces/environments-interface';
import {UnitTestPayload} from '../../interfaces/decisions-interface';

@Injectable({
    providedIn: 'root'
})

export class HttpService {
    private baseUrl = 'http://localhost:8080';
    private token: string | undefined = '';
    private refresh = 5 * 60 * 1000; // Try to refresh the JWT token every 5 mins

    constructor(
        private http: HttpClient,
        private keycloak: KeycloakService
    ) {
        this.token = this.keycloak.getToken();
        setInterval(() => {
            this.keycloak.updateToken().then((refreshed) => {
                if (refreshed) {
                    this.token = this.keycloak.getToken();
                }
            }).catch(() => {
                console.error('Failed to refresh token');
                this.keycloak.logout();
            })
        }, this.refresh);
    }

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
    getDMN(id: number): Observable<DMNInterface> {
        return this.http.get<DMNInterface>(`${this.baseUrl}/dmn/${id}`, {
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
     * Get deployment details by ID.
     * @param id - DMN ID
     * @returns Observable with deployment details
     * @internal
     */
    getDeploymentDetails(id: Number): Observable<DeploymentsInterface> {
        return this.http.get<any>(`${this.baseUrl}/deployments/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get all tests for specific DMN version.
     * @param id - DMN ID
     * @param version - DMN version number
     * @returns Observable with tests data
     * @internal
     */
    getTests(id: Number, version: Number): Observable<any> { // TODO Typing
        return this.http.get<any>(`${this.baseUrl}/test-deployment/${id}/${version}/tests`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }


    /**
     * Get review details for DMN version.
     * @param id
     * @param version
     */
    getReview(id: number, version: number): Observable<any> { // TODO Typing
        return this.http.get<any>(`${this.baseUrl}/lifecycle/${id}/${version}/review`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Get comments for DMN version.
     * @param id
     * @param version
     * @returns Observable with comments data
     * @internal
     */
    getComments(id: number, version: number): Observable<any> { // TODO Typing
        return this.http.get<any>(`${this.baseUrl}/lifecycle/${id}/${version}/comments`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Submit DMN version for review.
     * @param id - DMN ID
     * @param version - DMN version number
     * @param description - Change description
     * @param reviewer - Reviewer username
     * @returns Observable with submission result
     * @internal
     */
    submitForReview(id: number, version: number, description: String, reviewer: string): Observable<any> {
        const body = {
            dmnId: id,
            version: version,
            changeDescription: description,
            assignedTo: reviewer
        };
        return this.http.post<any>(`${this.baseUrl}/lifecycle/${id}/${version}/submit`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Cancel review for DMN version.
     * @param id
     * @param version
     * @param changeId
     * @returns Observable with cancellation result
     * @internal
     */
    cancelReview(id: number, version: number, changeId: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/lifecycle/${id}/${version}/${changeId}/cancel`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Submit review for DMN version.
     * @param id
     * @param version
     * @param changeId
     * @param approved
     * @param comment
     * @returns Observable with review submission result
     * @internal
     */
    submitReview(id: number, version: number, changeId: number, approved: boolean, comment: string): Observable<any> {
        const body = {
            changeId: changeId,
            approved: approved,
            comments: comment || ''
        }
        return this.http.post<any>(`${this.baseUrl}/lifecycle/${id}/${version}/${changeId}/review`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Execute unit test deployment.
     * @param data
     * @returns Observable with test execution result
     * @internal
     */
    executeUnitTest(data: UnitTestPayload): Observable<any> { // TODO Typing
        return this.http.post<any>(`${this.baseUrl}/test-deployment`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
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

    // TODO Implement activiationTime parameter to schedule deployment.
    /**
     * Deploy specific DMN version to environment.
     * @param dmn - DMNInterface of the DMN to deploy
     * @param version - Version number of the DMN to deploy
     * @param environment - EnvironmentsInterface of the environment to deploy to
     * @returns Observable with deployment result
     * @internal
     */
    deployVersion(dmn: DMNInterface, version: number, environment: EnvironmentsInterface){
        const body = {
            dmn: dmn,
            version: version,
            environment: environment,
            tenantId: "testrotterdam",
            deploymentSource: "DMN Tool",
            deployChangedOnly: false,
            enableDuplicateFiltering: true,
            deploymentName: dmn.name,
            activiationTime: null //TODO implementeren voor scheduled deployment.
        }

        return this.http.post<any>(`${this.baseUrl}/deployments`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    /**
     * Delete a deployment by ID.
     * @param id - ID of the deployment to delete.
     * @returns Observable<void> indicating completion.
     * @internal
     */
    deleteDeployment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/deployments/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        });
    }

    /**
     * Delete a Test by ID.
     * @param dmnId - ID of the test to delete.
     * @param version - Version of the DMN to delete.
     * @param testId - ID of the DMN to delete.
     * @returns Observable<void> indicating completion.
     * @internal
     */
    deleteTest(dmnId: number, version: number, testId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/test-deployment/${dmnId}/${version}/tests/${testId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        });
    }
}
