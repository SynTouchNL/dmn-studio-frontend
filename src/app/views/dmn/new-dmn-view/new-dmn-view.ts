import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DMNService } from '../../../services/dmn-service/dmn-service';
import { AlertService } from '../../../services/alert-service/alert-service';

@Component({
    selector: 'app-new-dmn-view',
    imports: [
        RouterLink,
        FormsModule
    ],
    templateUrl: './new-dmn-view.html',
    styleUrl: './new-dmn-view.css'
})
export class NewDMNView implements OnInit {
    dmnName: string = '';
    dmnDomain: string = '';
    dmnOwner: string = '';
    domains: any[] = [];
    dmnFileContent: string = '';

    constructor(
        private dmnService: DMNService,
        private alertService: AlertService,
        private router: Router
    ) { }

    ngOnInit(){
        this.dmnService.getDomains().subscribe(domains => {
            this.domains = domains;
        });
    }

    private sanitizeString(input: string): string {
        return input
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
    }

    submitForm(event: Event) {
        let new_xml = '';
        if (this.dmnFileContent){
            new_xml = this.dmnFileContent;
        } else {
            new_xml = `<?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="${this.sanitizeString(this.dmnName)}" name="${this.dmnName}" namespace="http://camunda.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="17.2.0">
              <decision id="decision_19w0x1w" name="">
                <decisionTable id="decisionTable_16f4dkd">
                  <input id="input1" label="">
                    <inputExpression id="inputExpression1" typeRef="string">
                      <text></text>
                    </inputExpression>
                  </input>
                  <output id="output1" label="" name="" typeRef="string" />
                </decisionTable>
              </decision>
              <dmndi:DMNDI>
                <dmndi:DMNDiagram id="DMNDiagram_0k7uk6v">
                  <dmndi:DMNShape id="DMNShape_1tqq611" dmnElementRef="decision_19w0x1w">
                    <dc:Bounds height="80" width="180" x="150" y="80" />
                  </dmndi:DMNShape>
                </dmndi:DMNDiagram>
              </dmndi:DMNDI>
            </definitions>`;
        }
        event.preventDefault();
        const encoder = new TextEncoder();
        const xmlBytes = encoder.encode(new_xml);
        const xmlBase64 = btoa(String.fromCharCode(...xmlBytes));

        const payload = {
            name: this.dmnName,
            owner: this.dmnOwner,
            domain_id: +this.dmnDomain,
            creator: "Mark Akkermans",
            newDiagram: xmlBase64
        };

        this.dmnService.createDMN(payload).subscribe(response => {
            this.alertService.success('Nieuwe DMN aangemaakt', this.dmnName);
            this.router.navigate(['/dmns']);
        });
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
