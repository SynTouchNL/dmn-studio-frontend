import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DMNService } from '../../../services/dmn-service/dmn-service';
import {
    DMNDomainInterface,
    DMNFileInterface,
    DMNInterface,
    DMNListInterface,
    DMNVersionInterface
} from '../../../interfaces/dmn-interface';
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { AlertService } from '../../../services/alert-service/alert-service';
import { EnvironmentsInterface } from '../../../interfaces/environments-interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-deployment-view',
    imports: [FormsModule, ReactiveFormsModule, StatusPipe],
    templateUrl: './new-deployment-view.html',
    styleUrl: './new-deployment-view.css'
})

export class NewDeploymentView implements OnInit {
    environments: any[] = [];
    domains: DMNDomainInterface[] = [];
    dmns: DMNListInterface = [];
    dmns_base: DMNListInterface = [];
    dmn_versions: DMNVersionInterface[] = [];
    file: DMNFileInterface | null = null;
    button_disabled: boolean = false;

    selected_dmn: DMNInterface | null = null;
    selected_version: DMNVersionInterface | null = null;
    selected_environment: EnvironmentsInterface | null = null;

    myForm: any;

    constructor(
        private dmnService: DMNService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.myForm = this.formBuilder.group({
            environments: new FormControl(null),
            dmns: new FormControl(null),
            domains: new FormControl(null),
            versions: new FormControl(null)
        });

        this.dmnService.getEnvironments().subscribe(
            data => {
                this.environments = Array.isArray(data) ? data : [data];
            }
        )
        this.dmnService.getDomains().subscribe(
            data => {
                //@ts-ignore
                this.domains = data;
            }
        )

        this.dmnService.getDMNs().subscribe(
            data => {
                this.dmns = data;
                this.dmns_base = data;
            }
        )

        this.myForm.get("domains").valueChanges.subscribe(
            (value: DMNDomainInterface) => {
                this.refreshDMNs()
                if (value !== null) {
                    this.dmns = this.dmns.filter(
                        (dmn: DMNInterface) => dmn.domain.id === value.id
                    )
                }
            }
        );

        this.myForm.get("dmns").valueChanges.subscribe(
            (value: DMNInterface) => {
                if (value !== null && Array.isArray(value.versions)) {
                    this.dmn_versions = value.versions;
                } else {
                    this.dmn_versions.push(value.versions);
                }
                this.selected_dmn = value;
            }
        );

        this.myForm.get("versions").valueChanges.subscribe(
            (value: DMNVersionInterface) => {
                this.selected_version = value;
            }
        );

        this.myForm.get("environments").valueChanges.subscribe(
            (value: EnvironmentsInterface) => {
                this.selected_environment = value;
            }
        );

    }

    refreshDMNs(){
        this.dmns = this.dmns_base;
    }

    deployVersion(){
        if (!this.selected_dmn || !this.selected_version || !this.selected_environment) {
            this.alertService.error("Fout bij het deployen.", "Selecteer een DMN, versie en omgeving om te kunnen deployen.");
        } else {
            this.dmnService.getDMNFile(this.selected_dmn.id, this.selected_version.version).subscribe(
                //@ts-ignore
                data => {
                    this.file = data;
                }
            );

            if (this.file) {
                this.dmnService.deployVersion(this.selected_dmn, this.file, this.selected_version.version, this.selected_environment).subscribe(
                    data => {
                        if (data) {
                            // @ts-ignore
                            this.alertService.success("De DMN versie wordt gedeployed!", this.selected_dmn.name);
                            this.router.navigate(["/deployments"]);
                        }
                    }, error => {
                        console.log(error);
                        this.alertService.error("Er is een fout opgetreden bij het deployen van de DMN versie.", error.error.details);
                    }
                )
            }
        }
    }
}
