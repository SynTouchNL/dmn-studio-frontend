import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { AlertService } from '../../../services/alert-service/alert-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-diagram-view',
    imports: [
        FormsModule,
        ReactiveFormsModule,
    ],
  templateUrl: './new-diagram-view.html',
  styleUrl: './new-diagram-view.css'
})
export class NewDiagramView implements OnInit{
    private activatedRoute = inject(ActivatedRoute);
    new_xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="nieuwe_dmn" name="Nieuwe DMN" namespace="http://camunda.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="17.2.0">
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
    creator = 'Mark Akkermans';
    dmn_id: number = 0;
    reuseDmn: string = "";
    dmnVersion: number = 0;

    constructor(
        private dmnService: DMNService,
        private alertService: AlertService,
        private router: Router,
        private titleService: Title
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.dmnVersion = navigation?.extras.state?.['version'];

        this.activatedRoute.params.subscribe((params) => {
            this.dmn_id = +params['id'] || 0;
        });
    }

    ngOnInit() {
        this.titleService.setTitle("DMN Tool - Nieuwe versie");
    }

    createNewVersion() {
        const encoder = new TextEncoder();
        let xmlBase64 = '';
        if (this.reuseDmn === "false") {
            const xmlBytes = encoder.encode(this.new_xml);
            xmlBase64 = btoa(String.fromCharCode(...xmlBytes));
            this.prepareVersion(xmlBase64);
        } else {
            this.dmnService.getDMNFile(this.dmn_id, this.dmnVersion).subscribe(
                data => {
                    //console.log(data.file)
                    const xmlBytes = encoder.encode(data.fileBlob);
                    xmlBase64 = btoa(String.fromCharCode(...xmlBytes));
                    this.prepareVersion(xmlBase64);
                }
            );
        }
    }

    prepareVersion(xmlBase64: string){
        const newVersion = {
            dmn_id: this.dmn_id,
            file: xmlBase64,
            created_by: this.creator
        };

        this.dmnService.createDMNVersion(newVersion).subscribe(
            response => {
                this.alertService.success('Nieuwe versie aangemaakt', "");
                this.router.navigate(['/dmns/', this.dmn_id, this.dmnVersion+1]);
            }, error => {
                if(error.status === 409){
                    this.alertService.error('Geen nieuwe versie mogelijk', 'Er is al een nieuwe versie in concept.');
                } else {
                    this.alertService.error('Geen nieuwe versie mogelijk', '');
                }
            }
        );
    }
}
