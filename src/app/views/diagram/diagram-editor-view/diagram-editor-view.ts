import { Component, AfterViewInit, ElementRef, ViewChild, inject, OnDestroy } from '@angular/core';
import DmnModeler from 'dmn-js/lib/Modeler';
import { DmnPropertiesPanelModule, CamundaPropertiesProviderModule, DmnPropertiesProviderModule } from 'dmn-js-properties-panel';
import { from, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import camundaModdle from 'camunda-dmn-moddle/resources/camunda.json';

// Services
import { HttpService } from '../../../services/http-service/http-service';
import { AlertService } from '../../../services/alert-service/alert-service';

// Interfaces
import { ViewList } from '../../../interfaces/view-interface';

@Component({
    selector: 'app-diagram-editor-view',
    imports: [],
    templateUrl: './diagram-editor-view.html',
    styleUrl: './diagram-editor-view.css'
})

export class DiagramEditorView implements AfterViewInit, OnDestroy {
    @ViewChild('dmnModelerRef', { static: true }) private dmnModelerRef: ElementRef | undefined;
    @ViewChild('editorTabRef', { static: true }) editorTabs!: ElementRef;

    private dmnJS: DmnModeler;
    private dmnDetails: any;
    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnFile: any = "";
    views: ViewList = [];
    activeViewIdx: number = 0;
    idx: number = 0;

    private activatedRoute = inject(ActivatedRoute);

    constructor(
        private router: Router,
        private dmnService: HttpService,
        private alertService: AlertService,
        private titleService: Title
    ) {
        const navigation = this.router.currentNavigation(); // TODO: Review deprecation
        this.dmnVersion = navigation?.extras.state?.['version'];
        this.dmnId = navigation?.extras.state?.['id'];
        this.dmnFile = navigation?.extras.state?.['file'];

        this.dmnJS = new DmnModeler({
            container: this.dmnModelerRef?.nativeElement,
            width: "100%",
            height: "100%",
            position: "absolute",
            moddleExtensions: {
                camunda: camundaModdle
            },
            drd: {
                propertiesPanel: {
                    parent: '#dmn-properties-panel'
                },
                additionalModules: [
                    DmnPropertiesPanelModule,
                    DmnPropertiesProviderModule,
                    CamundaPropertiesProviderModule
                ]
            }
        });

        this.dmnJS.on('views.changed', (event: any) => {
            this.views = event.views;
            this.activeViewIdx = this.views.indexOf(event.activeView);
        });

        this.activatedRoute.params.subscribe(params => {
            this.dmnVersion = +params['version'];
        });

        this.activatedRoute.params.subscribe((params) => {
            this.dmnId = +params['id'] || 0;
        });
    }

    ngAfterViewInit(): void {
        this.dmnJS.attachTo(this.dmnModelerRef!.nativeElement);
        if(!this.dmnFile || this.dmnFile === ""){
            this.dmnService.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
                data => {
                    this.dmnFile = data.fileBlob;
                    this.importDiagram(this.dmnFile);
                }
            )
        } else {
            this.importDiagram(this.dmnFile);
        }
        this.titleService.setTitle("DMNStudio - DMN Bewerken - " + (this.dmnDetails?.name || ''));
    }

    ngOnDestroy(): void {
        this.dmnJS?.destroy();
    }

    private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
        return from(
            this.dmnJS.importXML(xml)
                .then((result: any) => { return result; })
                .catch((err: any) => {
                    this.alertService.error("Error", "Er was een probleem bij het laden van de diagram: " + err.message);
                    throw err;
                })
        )
    }

    async saveDiagram() {
        try {
            this.dmnJS.saveXML({format: true})
                .then((result: any) => { this.processSave(result.xml); })
                .catch((err: any) => {
                    this.alertService.error("Error", "Er was een probleem bij het opslaan van de diagram: " + err.message);
                    return;
                });

        } catch(err: any) {
            this.alertService.error("Error", "Er was een probleem bij het opslaan van de diagram: " + err.message);
            return;
        }
    }

    private processSave(xml: string){
        const encoder = new TextEncoder();
        const xmlBytes = encoder.encode(xml);

        let request = {
            fileBlob: btoa(String.fromCharCode(...xmlBytes)),
            modifiedBy: 'Mark Akkermans'
        };

        this.dmnService.saveDMNFile(this.dmnId, this.dmnVersion, request).subscribe({
            next: response => {
                if (response) {
                    this.alertService.success('Diagram opgeslagen', '');
                    this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion]);
                }
            }, error: error => {
                this.alertService.error("Error", "Er was een probleem bij het opslaan van de diagram: " + error.message);
            }
        });
    }


    openView(idx: number){
        this.activeViewIdx = idx;
        try {
            this.dmnJS.open(this.views[idx]);
        } catch (err) {
            console.error('error opening tab', err);
        }
    }

    checkClass(type: string){
        switch(type) {
            case "drd":
                return "dmn-icon-lasso-tool";
            case "decisionTable":
                return "dmn-icon-decision-table";
            case "literalExpression":
                return "dmn-icon-literal-expression";
            default:
                return ""
        }
    }

}
