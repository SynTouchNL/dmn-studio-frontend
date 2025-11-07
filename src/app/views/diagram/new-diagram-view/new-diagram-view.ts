import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http-service/http-service';
import { AlertService } from '../../../services/alert-service/alert-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { new_dmn } from '../../../new_dmn';

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
    new_xml = new_dmn;
    creator = 'Mark Akkermans';
    dmn_id: number = 0;
    reuseDmn: string = "";
    dmnVersion: number = 0;

    constructor(
        private dmnService: HttpService,
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
            dmnId: this.dmn_id,
            fileBlob: xmlBase64,
            createdBy: this.creator
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
