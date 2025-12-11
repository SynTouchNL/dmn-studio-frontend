import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HttpService } from '../../../services/http-service/http-service';
import { AlertService } from '../../../services/alert-service/alert-service';
import { DMNDomainInterface } from '../../../interfaces/dmn-interface';
import { Title } from '@angular/platform-browser';
import { DocumentService } from '../../../services/document-service/document-service';
import { TypeaheadUsersPartial } from '../../../partials/typeahead-partial/typeahead-users-partial';
import {UserInterface} from '../../../interfaces/user-interface';

@Component({
    selector: 'app-dmn-create-view',
    imports: [RouterLink, FormsModule, TypeaheadUsersPartial],
    templateUrl: './dmn-create-view.html',
    styleUrl: './dmn-create-view.css'
})

export class DmnCreateView implements OnInit {
    dmnName: string = '';
    dmnDomain: string = '';
    dmnOwner: string = '';
    domains: DMNDomainInterface[] = [];
    dmnFileContent: string = '';
    dmnUsers: UserInterface[] = [];

    constructor(
        private dmnService: HttpService,
        private alertService: AlertService,
        private router: Router,
        private titleService: Title,
        private documentService: DocumentService
    ) { }

    ngOnInit(){
        this.dmnService.getDomains().subscribe(
            data => {
                this.domains = Array.isArray(data) ? data : [data];
            }
        );
        this.dmnService.getUsers().subscribe({
            next: data => {
                this.dmnUsers = data ? data : [];
            }
        })
        this.titleService.setTitle("DMNStudio - Nieuwe DMN aanmaken ");

    }

    onUserPicked(user: UserInterface){
        this.dmnOwner = user.username;
    }

    submitForm(event: Event) {
        let new_xml = '';
        if (this.dmnFileContent) {
            new_xml = this.dmnFileContent;
        } else {
            new_xml = this.documentService.generateNewDiagram(this.dmnName);
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
