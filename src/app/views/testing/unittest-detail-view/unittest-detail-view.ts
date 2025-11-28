import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';
import {Title} from '@angular/platform-browser';
import {BreadcrumbsPartial} from '../../../partials/breadcrumbs-partial/breadcrumbs-partial';

@Component({
  selector: 'app-unittest-detail-view',
    imports: [
        RouterLink,
        BreadcrumbsPartial
    ],
  templateUrl: './unittest-detail-view.html',
  styleUrl: './unittest-detail-view.css'
})

export class UnittestDetailView implements OnInit {
    dmnData: any = {};
    testData: any = {};

    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnName: string = "";
    breadcrumb: { label: string, url: string, current: boolean }[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: HttpService,
        private titleService: Title
    ) {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data ?? this.dmnData;
        this.dmnName = navState.name ?? this.dmnName;

        this.titleService.setTitle("DMNStudio - Test details - " + (this.dmnData.name || ''));
        this.breadcrumb = [
            { label: 'DMN overzicht', url:'/dmns', current: false },
            { label: 'DMN details', url:'/dmns/' + this.dmnId + '/' + this.dmnVersion, current: false },
            { label: this.dmnData?.name + ' details', url:'/dmns/' + this.dmnId + '/' + this.dmnVersion + '/test/view', current: true }
        ]
    }

    ngOnInit(){
        this.dmnId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.dmnVersion = Number(this.activatedRoute.snapshot.paramMap.get('version'));
        if (this.dmnId && this.dmnVersion) {
            this.http.getTests(+this.dmnId, +this.dmnVersion).subscribe(
                data => {
                    this.testData = data || [];
                }
            );
        }
    }
}
