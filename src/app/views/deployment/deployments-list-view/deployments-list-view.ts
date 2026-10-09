import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClassPipe } from '../../../pipes/class-pipe/class-pipe';
import { DatePipe } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { DeploymentsInterface } from '../../../interfaces/deployments-interface';
import { HttpService } from '../../../services/http-service/http-service';
import { Title } from '@angular/platform-browser';
import { EnvironmentInterface } from '../../../interfaces/environments-interface';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';
import { ROUTE_ROLES } from '../../../../auth';

@Component({
    selector: 'app-deployments-list-view',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        NgbPagination,
        DatePipe,
        ClassPipe,
        StatusPipe,
    ],
    templateUrl: './deployments-list-view.html',
    styleUrl: './deployments-list-view.css'
})

export class DeploymentsListView implements OnInit, OnChanges {
    deployment_list: DeploymentsInterface[] = [];
    all_deployments: DeploymentsInterface[] = [];
    environments: EnvironmentInterface[] = [];
    readonly DELETED_ENVIRONMENT = 'deleted';
    page: number = 1
    pageSize: number = 10;
    collectionSize: number = 0;
    myForm: any;

    constructor(
        private http: HttpService,
        private formBuilder: FormBuilder,
        private titleService: Title,
        private keycloakService: KeycloakService
    ) {}

    get canDeploy(): boolean {
        return this.keycloakService.hasAnyRole(ROUTE_ROLES.DEPLOYMENT_CREATE);
    }

    ngOnInit(){
        this.http.getDeployments().subscribe(
            data => {
                // @ts-ignore
                this.all_deployments = data;
                this.collectionSize = this.all_deployments.length;
                this.refreshDeployments();
            }
        )

        this.http.getEnvironments().subscribe({
            next: data => {
                this.environments = Array.isArray(data) ? data : [];
            },
            // The filter is optional; without environments only "Alle omgevingen" remains.
            error: () => {
                this.environments = [];
            }
        })

        this.titleService.setTitle("DMNStudio - Deployment overzicht");

        this.myForm = this.formBuilder.group({
            environments: new FormControl(null),
            search: new FormControl(null)
        });

        this.myForm.get("environments").valueChanges.subscribe(
            (value: number | typeof this.DELETED_ENVIRONMENT | null) => {
                if (value !== null) {
                    const environmentId = value === this.DELETED_ENVIRONMENT ? null : value;
                    this.http.getDeployments().subscribe(
                        data => {
                            //@ts-ignore
                            this.deployment_list = data.filter(dep => dep.environmentId === environmentId);
                        }
                    )
                } else {
                    this.http.getDeployments().subscribe(data => {
                        this.deployment_list = Array.isArray(data) ? data : [data];
                    });
                }
            }
        );

        this.myForm.get("search").valueChanges.subscribe(
            (value: string) => {
                if(value == ""){
                    this.refreshDeployments();
                } else {
                    this.deployment_list = this.deployment_list.filter(dep => dep.dmn.name.toLowerCase().includes(value.toLowerCase()) || dep.deployedBy.toLowerCase().includes(value.toLowerCase()) );
                }
            }
        )
    }

    ngOnChanges(){
        this.collectionSize = this.all_deployments.length;
        this.refreshDeployments();
    }

    refreshDeployments(){
        this.deployment_list = this.all_deployments
        .map((dmn: any, i: number) => ({ id: i + 1, ...dmn }))
        .slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize,
        );
    }

}
