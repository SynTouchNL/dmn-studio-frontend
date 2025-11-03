import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DMNService } from '../../../services/dmn-service/dmn-service';
import { AlertService } from '../../../services/alert-service/alert-service';
import { DMNDomainInterface } from '../../../interfaces/dmn-interface';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';
import { new_dmn } from '../../../new_dmn';

@Component({
    selector: 'app-new-dmn-view',
    imports: [RouterLink, FormsModule],
    templateUrl: './new-dmn-view.html',
    styleUrl: './new-dmn-view.css'
})

export class NewDMNView implements OnInit {
    dmnName: string = '';
    dmnDomain: string = '';
    dmnOwner: string = '';
    domains: DMNDomainInterface[] = [];
    dmnFileContent: string = '';
    users: any[] = [];

    constructor(
        private dmnService: DMNService,
        private alertService: AlertService,
        private router: Router,
        private keycloakService: KeycloakService
    ) { }

    ngOnInit(){
        this.dmnService.getDomains().subscribe(
            data => {
                this.domains = Array.isArray(data) ? data : [data];
            }
        );
        this.keycloakService.getUsers().subscribe(
            (data: any[]) => {
                this.users = data;
            }
        );

    }

    private sanitizeString(input: string): string {
        return input
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
    }

    submitForm(event: Event) {
        let new_xml = '';
        if (this.dmnFileContent) {
            new_xml = this.dmnFileContent;
        } else {
            new_xml = new_dmn;
        }
        event.preventDefault();
        const encoder = new TextEncoder();
        const xmlBytes = encoder.encode(new_xml);
        const xmlBase64 = btoa(String.fromCharCode(...xmlBytes));

        const payload = {
            name: this.dmnName,
            owner: this.dmnOwner,
            domainId: +this.dmnDomain,
            fileBlob: xmlBase64
        };

        this.dmnService.createDMN(payload).subscribe(
            response => {
                this.alertService.success('Nieuwe DMN aangemaakt', response.name);
                this.router.navigate(['/dmns']);
            }
        );
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.dmnFileContent = reader.result as string;
            };
            reader.readAsText(file);
        }
    }
}
