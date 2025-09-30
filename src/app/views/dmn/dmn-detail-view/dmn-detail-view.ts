import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DmnStatusPartial } from '../../../partials/dmn-status-partial/dmn-status-partial';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { Title } from '@angular/platform-browser';

// Pipes
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { ClassPipe } from '../../../pipes/class-pipe/class-pipe';
import { DatePipe } from '@angular/common';

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

export class DmnDetailView implements OnInit, DoCheck {
    dmnId: number = 0;
    dmnData: any = [];
    dmnVersion: number = 0;
    dmnVersions: any = []

    private activatedRoute = inject(ActivatedRoute);

    constructor(
        private dmnService: DMNService,
        private titleService: Title,
        private router: Router
        ) {

        this.activatedRoute.params.subscribe(params => {
            this.dmnVersion = +params['version'];
        });

        this.activatedRoute.params.subscribe((params) => {
            this.dmnId = +params['id'] || 0;
        });
    }

    ngOnInit() {
        this.fetchData();
        this.dmnService.getDMNVersions(this.dmnId).subscribe(
            data => {
                this.dmnVersions = data;
            }
        )
    }

    ngDoCheck(){
        this.fetchData();
    }

    fetchData(){
        this.dmnService.getDMN(this.dmnId, this.dmnVersion).subscribe(
            data => {
                this.dmnData = data;
                if(isNaN(this.dmnVersion)) {
                    this.dmnVersion = this.dmnData.latest_version;
                }
                this.titleService.setTitle(`DMN Detail - ${this.dmnData.name} v${this.dmnVersion}`)
            }
        );
    }

    clickOpen() {
        this.dmnService.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
            data => {
                this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion +'/view'], {state: {id: data.id, version: data.version, file: data.file}})
            }
        )
    }
}
