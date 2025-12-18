import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';
import { DecisionVariables, Variable } from '../../../interfaces/decisions-interface';
import { Title } from '@angular/platform-browser';

import { BreadcrumbsPartial } from '../../../partials/breadcrumbs-partial/breadcrumbs-partial';
import { DocumentService } from '../../../services/document-service/document-service';
import {
    NgbAccordionBody,
    NgbAccordionButton, NgbAccordionCollapse,
    NgbAccordionDirective, NgbAccordionHeader,
    NgbAccordionItem,
    NgbNav,
    NgbNavItem,
    NgbNavModule,
    NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unittest-list-view',
    imports: [
        NgbNavModule,
        RouterLink,
        BreadcrumbsPartial,
        NgbNavItem,
        NgbNav,
        NgbNavOutlet,
    ],
  templateUrl: './unittest-list-view.html',
  styleUrl: './unittest-list-view.css'
})

export class UnittestListView implements OnInit {
    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnFile: string = "";
    dmnVars: DecisionVariables[] = [];
    dmnData: any = {};
    dmnName: string = "";
    testData: any[] = [];
    selectedDMN_naam: string = "";
    breadcrumb: { label: string, url: string, current: boolean }[] = [];

    constructor
    (
        private activatedRoute: ActivatedRoute,
        private http: HttpService,
        private router: Router,
        private titleService: Title,
        private documentService: DocumentService
    )
    {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data ?? this.dmnData;
        this.dmnName = navState.name ?? this.dmnName;
    }

    ngOnInit(){
        this.dmnId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.dmnVersion = Number(this.activatedRoute.snapshot.paramMap.get('version'));

        this.titleService.setTitle("DMNStudio - Test overzicht ");

        this.breadcrumb = [
            { label: 'DMN-overzicht', url:'/dmns', current: false },
            { label: 'DMN details', url:'/dmns/' + this.dmnId + '/' + this.dmnVersion, current: false },
            { label: 'Unit-tests', url: '/dmns/' + this.dmnId + '/' + this.dmnVersion +'/test', current: true }
        ]

        this.loadDMN();

        if (this.dmnId && this.dmnVersion) {
            this.http.getTests(+this.dmnId, +this.dmnVersion).subscribe(
                data => {
                    this.testData = data || [];
                }
            );
        }
    }

    loadDMN(){
        this.http.getDMNFile(this.dmnId, this.dmnVersion).subscribe(async (data)  => {
            this.dmnVars = await this.documentService.parseDMNVariables(atob(data.fileBlob));
            this.selectedDMN_naam = this.dmnVars[0].name;
            this.dmnFile = atob(data.fileBlob);
        });
    }

    deleteTest(testId: number) {
        this.http.deleteTest(this.dmnId, this.dmnVersion, testId).subscribe(
            () => {
                this.testData = this.testData.filter(test => test.id !== testId);
            }
        );
    }
}
