import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpService } from '../../../services/http-service/http-service';
import { AlertService } from '../../../services/alert-service/alert-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {DocumentService} from '../../../services/document-service/document-service';

@Component({
  selector: 'app-new-diagram-view',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './new-diagram-view.html',
  styleUrl: './new-diagram-view.css'
})

export class NewDiagramView implements OnInit{
    private activatedRoute = inject(ActivatedRoute);
    new_xml = "";
    creator = 'Mark Akkermans'; // TODO: ref
    dmn_id: number = 0;
    reuseDmn: number = 0;
    dmnVersion: number = 0;
    importDMN: string = "";
    myForm: any;
    dmnData: any = [];

    constructor(
        private dmnService: HttpService,
        private alertService: AlertService,
        private router: Router,
        private titleService: Title,
        private formBuilder: FormBuilder,
        private documentService: DocumentService
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.dmnData = navigation?.extras.state?.['dmn'];
        this.dmnVersion = navigation?.extras.state?.['version'];
        this.activatedRoute.params.subscribe((params) => {
            this.dmn_id = +params['id'] || 0;
        });
    }

    ngOnInit() {
        this.titleService.setTitle("DMNStudio - Nieuwe versie aanmaken");
            this.myForm = this.formBuilder.group({
                input_key: new FormControl(null),
            });
            this.titleService.setTitle("DMNStudio - Test aanmaken ");
    }

    createNewVersion() {
        const encoder = new TextEncoder();
        let input = '';
        let xmlBase64 = '';
        this.new_xml = this.documentService.generateNewDiagram(this.dmnData.name);
        if (this.reuseDmn == 2) { // new XML
            const xmlBytes = encoder.encode(this.new_xml);
            xmlBase64 = btoa(String.fromCharCode(...xmlBytes));
            input = xmlBase64;
        } else if (this.reuseDmn == 3) { // import XML
            if (this.importDMN === '') {
                this.alertService.error('Geen bestand geselecteerd', 'Selecteer een geldig DMN bestand.');
                return;
            }
            const xmlBytes = encoder.encode(this.importDMN);
            xmlBase64 = btoa(String.fromCharCode(...xmlBytes));
            input = xmlBase64;
        } else { // reuse existing
            this.dmnService.getDMNFile(this.dmn_id, this.dmnVersion).subscribe(
                data => {
                    input = data.fileBlob;
                }
            );
        }
        this.prepareVersion(input);
    }

    prepareVersion(xmlBase64: string){
        const newVersion = {
            dmnId: this.dmn_id,
            fileBlob: xmlBase64,
            createdBy: this.creator
        };

        this.dmnService.createDMNVersion(newVersion).subscribe({
            next: response => {
                this.alertService.success('Nieuwe versie aangemaakt', "");
                this.router.navigate(['/dmns/', this.dmn_id, this.dmnVersion+1]);
            },
            error: error => {
                if(error.status === 409){
                    this.alertService.error('Geen nieuwe versie mogelijk', 'Er is al een nieuwe versie in concept.');
                } else {
                    this.alertService.error('Geen nieuwe versie mogelijk', '');
                }
            }
        });
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.importDMN = reader.result as string;
            };
            reader.readAsText(file);
        }
    }
}
