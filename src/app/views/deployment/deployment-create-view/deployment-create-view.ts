import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http-service/http-service';
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
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-deployment-create-view',
    imports: [FormsModule, ReactiveFormsModule, StatusPipe],
    templateUrl: './deployment-create-view.html',
    styleUrl: './deployment-create-view.css'
})

export class DeploymentCreateView implements OnInit {
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
    clicked: boolean = false;

    constructor(
        private dmnService: HttpService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private router: Router,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        this.myForm = this.formBuilder.group({
            environments: new FormControl(null),
            dmns: new FormControl(null),
            domains: new FormControl(null),
            versions: new FormControl(null)
        });

        this.titleService.setTitle("DMNStudio - Nieuwe deployment aanmaken");


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

    onSubmit(event: Event) {
        event.preventDefault();
        this.clicked = true;
        if (!this.selected_dmn || !this.selected_version || !this.selected_environment) {
            this.alertService.error("Fout bij het deployen.", "Selecteer een DMN, versie en omgeving om te kunnen deployen.");
            this.clicked = false;
            return;
        }
        const dmn = this.selected_dmn;
        const version = this.selected_version;
        const env = this.selected_environment;

        this.dmnService.deployVersion(dmn, version.version, env).subscribe({
            next: (data) => {
                this.alertService.success("De DMN versie wordt gedeployed!", dmn.name);
                this.router.navigate(["/deployments"]);
            },
            error: (error) => {
                this.alertService.error("Er is een fout opgetreden bij het deployen van de DMN versie.", error.error.details);
            }
        });
    }
}
