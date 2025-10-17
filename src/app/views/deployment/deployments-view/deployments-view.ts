import {Component, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ClassPipe} from '../../../pipes/class-pipe/class-pipe';
import {DatePipe} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {StatusPipe} from '../../../pipes/status-pipe/status-pipe';
import {DeploymentsInterface} from '../../../interfaces/deployments-interface';
import {DMNService} from '../../../services/dmn-service/dmn-service';

@Component({
    selector: 'app-deployments-view',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        NgbPagination,
        DatePipe,
        ClassPipe,
        StatusPipe,
    ],
    templateUrl: './deployments-view.html',
    styleUrl: './deployments-view.css'
})

export class DeploymentsView implements OnInit, OnChanges {
    deployment_list: DeploymentsInterface[] = [];
    all_deployments: DeploymentsInterface[] = [];
    environments: any[] = [];
    page: number = 1
    pageSize: number = 10;
    collectionSize: number = 0;
    myForm: any;

    constructor(
        private dmnService: DMNService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(){
        this.dmnService.getDeployments().subscribe(
            data => {
                // @ts-ignore
                this.all_deployments = data;
                this.collectionSize = this.all_deployments.length;
                this.refreshDeployments();
            }
        )
        this.dmnService.getEnvironments().subscribe(
            //@ts-ignore
            data => {
                this.environments = Array.isArray(data) ? data : [data];
            }
        )

        this.myForm = this.formBuilder.group({
            environments: new FormControl(null),
            search: new FormControl(null)
        });

        this.myForm.get("environments").valueChanges.subscribe(
            (value: { id: number, name: string }) => {
                if (value !== null) {
                    this.dmnService.getDeployments().subscribe(
                        data => {
                            //@ts-ignore
                            this.deployment_list = data.filter(dep => dep.environmentName === value.name);
                        }
                    )
                } else {
                    this.dmnService.getDeployments().subscribe(data => {
                        this.deployment_list = Array.isArray(data) ? data : [data];
                    });
                }
            }
        );
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
