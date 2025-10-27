import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import NavigatedViewer from "dmn-js/lib/NavigatedViewer";
import { from, Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { base64ToXml } from '../../../utils'

// Services
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { AlertService } from '../../../services/alert-service/alert-service';

// Interfaces
import { ViewList } from '../../../interfaces/view-interface';

@Component({
    selector: 'app-diagram-readonly-view',
    imports: [
        RouterLink
    ],
    templateUrl: './diagram-readonly-view.html',
    styleUrl: './diagram-readonly-view.css'
})

export class DiagramReadonlyView implements AfterViewInit, OnDestroy {
    @ViewChild('dmnViewerRef', {static: true}) private dmnViewerRef: ElementRef | undefined;

    private dmnJS: NavigatedViewer;

    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnFile: any = "";
    dmnStatus: number = 0;

    //Tabs
    views: ViewList = [];
    activeViewIdx: number = 0;
    idx: number = 0;

    private activatedRoute = inject(ActivatedRoute);

    constructor(
        private router: Router,
        private dmnService: DMNService,
        private alertService: AlertService,
        private titleService: Title
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.dmnId = navigation?.extras.state?.['id'];
        this.dmnVersion = navigation?.extras.state?.['version'];
        this.dmnFile = navigation?.extras.state?.['file'];
        this.dmnStatus = navigation?.extras.state?.['status'];

        this.dmnJS = new NavigatedViewer({
            container: this.dmnViewerRef?.nativeElement,
            width: "100%",
            height: "100%",
            position: "absolute",
            decisionTable: {
                keyboard: {
                    bindTo: document
                }
            },
            drd: {
            }
        });

        this.dmnJS.on('views.changed', (event: any) => {
            this.views = event.views;
            this.activeViewIdx = this.views.indexOf(event.activeView);
        });

        this.activatedRoute.params.subscribe(params => {
            this.dmnVersion = +params['version'];
            this.dmnId = +params['id'] || 0;
        });
    }

    ngAfterViewInit(): void {
        this.dmnJS.attachTo(this.dmnViewerRef!.nativeElement);
        this.initDiagram();
        this.titleService.setTitle("DMN Tool - Bekijk DMN");
    }

    ngOnDestroy(): void {
        this.dmnJS?.destroy();
    }

    private initDiagram(): void {
        if(!this.dmnFile || this.dmnFile === ""){
            this.dmnService.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
                data => {
                    this.importDiagram(atob(data.fileBlob));
                },
                error => console.log(error)
            )
        } else {
            this.importDiagram(this.dmnFile);
        }
    }

    private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
        return from(
            this.dmnJS.importXML(xml)
                .then((result: any) => {
                    return result;
                })
                .catch((err: any) => {
                    this.alertService.error("Error", "Er was een probleem bij het laden van de diagram: " + err.message);
                    throw err;
                })
        );
    }

    async openView(idx: number){
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
