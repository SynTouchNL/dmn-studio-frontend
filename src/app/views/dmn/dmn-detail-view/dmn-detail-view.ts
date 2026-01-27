import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DmnStatusPartial } from '../../../partials/dmn-status-partial/dmn-status-partial';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DMNVersionInterface } from '../../../interfaces/dmn-interface';

// Services
import { HttpService } from '../../../services/http-service/http-service';
import { Title } from '@angular/platform-browser';

// Pipes
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { ClassPipe } from '../../../pipes/class-pipe/class-pipe';
import { DatePipe } from '@angular/common';
import {DocumentService} from '../../../services/document-service/document-service';

@Component({
    selector: 'app-dmn-detail-view',
    imports: [
        StatusPipe,
        ClassPipe,
        DatePipe,
        RouterLink,
        DmnStatusPartial,
        NgbDropdownModule
    ],
    templateUrl: './dmn-detail-view.html',
    styleUrl: './dmn-detail-view.css'
})

export class DmnDetailView implements OnInit {
    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnData: any = [];
    versionInProduction: number = 0;

    private activatedRoute = inject(ActivatedRoute);

    constructor(
        private http: HttpService,
        private titleService: Title,
        private router: Router,
        private documentService: DocumentService
    ) {
        this.activatedRoute.params.subscribe(params => {
            this.dmnVersion = Number(params['version']) || 0;
        });
        this.activatedRoute.params.subscribe((params) => {
            this.dmnId = Number(params['id']) || 0;
        });
    }

    ngOnInit() {
        this.fetchData();
        this.http.getVersionInEnv(this.dmnId, this.dmnVersion, 3).subscribe({
            next: (data) => {
                this.versionInProduction = data.version || 0;
            },
            error: (err) => {
                console.error('Error fetching version in production:', err);
            }
        });
    }

    fetchData(){
        this.http.getDMN(this.dmnId).subscribe(
            data => {
                this.dmnData = data;
                this.titleService.setTitle(`DMNStudio - Detail - ${this.dmnData.name} - v${this.dmnVersion}`)
            }
        );
    }

    clickOpen() {
        this.http.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
            data => {
                this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion +'/view'], {state: {id: data.id, version: data.version, status: data.status, file: atob(data.fileBlob)}})
            }
        )
    }

    clickReview() {
        this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion + '/review'], {state: {data: this.dmnData}});
    }

    clickTests() {
        let dmnFile = "";
        this.http.getDMNFile(this.dmnId, this.dmnVersion).subscribe( async data => {
            dmnFile = atob(data.fileBlob);
        })
        this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion +'/test'], { state: { data: this.dmnData, file: atob(dmnFile) } })
    }

    selectedVersion(versions: DMNVersionInterface[]): DMNVersionInterface {
        return versions?.filter(v => v.version === this.dmnVersion)[0];
    }

    findLatest(dmnVersions: DMNVersionInterface[]): DMNVersionInterface {
        return this.documentService.findLatest(dmnVersions);
    }

    canStartNewVersion(dmnVersions: DMNVersionInterface[], statusNum: number): boolean {
        return this.documentService.canStartNewVersion(dmnVersions, statusNum)
    }


    protected readonly Object = Object;
}
