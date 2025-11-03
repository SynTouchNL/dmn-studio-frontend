import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DmnStatusPartial } from '../../../partials/dmn-status-partial/dmn-status-partial';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DMNVersionInterface } from '../../../interfaces/dmn-interface';

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

export class DmnDetailView implements OnInit {
    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnData: any = [];

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
    }

    fetchData(){
        this.dmnService.getDMN(this.dmnId).subscribe(
            data => {
                this.dmnData = data;
                this.titleService.setTitle(`DMN Detail - ${this.dmnData.name} - v${this.dmnVersion}`)
            }
        );
    }

    clickOpen() {
        this.dmnService.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
            data => {
                this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion +'/view'], {state: {id: data.id, version: data.version, file: atob(data.fileBlob)}})
            }
        )
    }

    selectedVersion(versions: DMNVersionInterface[]): DMNVersionInterface {
        return versions.filter(v => v.version === this.dmnVersion)[0];
    }

    findLatest(versions: DMNVersionInterface[]): DMNVersionInterface {
        const prodStatus = 4;
        const exact = versions.find(v => v.status === prodStatus);
        if (exact) return exact;

        for (let s = prodStatus - 1; s >= 1; s--) {
            const found = versions.find(v => v.status === s);
            if (found) return found;
        }
        return versions[0];
    }

    canStartNewVersion(versions: DMNVersionInterface[], status: number): boolean {
        if (status === 5) { // Archived
            return false;
        }

        if (status === 4) { // Production
            const hasLower = versions.some(v => v.status < 4);
            if (hasLower) return false;// there is already a lower status
        }

        if (status === 1) { // Bestaande concept
            return false;
        }

        if (status < 4) { // anders, zo lang hoogste status
            const hasHigher = versions.some(v => v.status > status);
            if (hasHigher) return false; // there is already a higher status
        }

        return true;
    }

}
