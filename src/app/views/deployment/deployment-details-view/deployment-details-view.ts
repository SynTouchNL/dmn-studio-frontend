import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';
import { DeploymentsInterface } from '../../../interfaces/deployments-interface';
import { ClassPipe } from '../../../pipes/class-pipe/class-pipe';
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import {AlertService} from '../../../services/alert-service/alert-service';
import {KeycloakService} from '../../../services/keycloak-service/keycloak-service';
import {ROUTE_ROLES} from '../../../../auth';

@Component({
  selector: 'app-deployment-details-view',
    imports: [
        RouterLink,
        ClassPipe,
        StatusPipe,
        DatePipe
    ],
  templateUrl: './deployment-details-view.html',
  styleUrl: './deployment-details-view.css'
})

export class DeploymentDetailsView implements OnInit {
    deploymentData: DeploymentsInterface[] = [];
    private activatedRoute = inject(ActivatedRoute);
    deploymentId: number = 0;

    constructor(
        private http: HttpService,
        private router: Router,
        private titleService: Title,
        private alertService: AlertService,
        private keycloakService: KeycloakService
    ) {}

    get canUndeploy(): boolean {
        return this.keycloakService.hasAnyRole(ROUTE_ROLES.DEPLOYMENT_CREATE);
    }

    ngOnInit() {
        this.deploymentId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.http.getDeploymentDetails(this.deploymentId).subscribe(
            data => {
                this.deploymentData = Array.isArray(data) ? data : [data];
            }
        )
        this.titleService.setTitle("DMNStudio - Details deployment");
    }

    clickOpen() {
        this.router.navigate([`/dmns/${this.deploymentData[0].dmnId}/${this.deploymentData[0].dmnVersion.version}`])
    }

    clickDelete(){
        const environmentId = this.deploymentData[0].environmentId;
        // Without an environment there is no engine URL to undeploy from.
        if (!this.canUndeploy || environmentId === null) {
            return;
        }
        this.http.deleteDeployment(this.deploymentData[0].deploymentId, environmentId).subscribe({
            next: (data) => {
                this.alertService.success('Deployment succesvol verwijderd', this.deploymentData[0].dmn.name + " deployment verwijderd.");
                this.router.navigate(['/deployments']);
            },
            error: (error) => {
                this.alertService.error('Fout bij verwijderen deployment', error.error?.message || 'Er is een fout opgetreden bij het verwijderen van de deployment.');
            }
        });
    }

}
