import { Component } from '@angular/core';
import { HttpService } from '../../../services/http-service/http-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert-service/alert-service';

@Component({
    selector: 'app-indienen-view',
    imports: [],
    templateUrl: './indienen-view.html',
    styleUrl: './indienen-view.css'
})
export class IndienenView {
    editor: string = 'Mark Akkermans';
    dmnVersion: number = 0;
    dmnId: number = 0;

    constructor(
        private dmnService: HttpService,
        private activatedRoute: ActivatedRoute,
        private alertService: AlertService,
        private router: Router
    ) {
        this.activatedRoute.params.subscribe(params => {
            this.dmnVersion = +params['version'];
        });

        this.activatedRoute.params.subscribe((params) => {
            this.dmnId = +params['id'] || 0;
        });
    }

    handInChanges(){
        this.dmnService.updateVersion(this.dmnId, this.dmnVersion, 3, this.editor).subscribe(
            data => {
                this.router.navigate([`/dmns/${this.dmnId}/${this.dmnVersion}`], { state: { data: data }});
            },
            error => {
                if (error.status === 400) {
                    this.alertService.error('Fout bij het indienen van de wijzigingen.', 'Alleen diagrammen met status Concept en Testing mogen ingediend worden!');
                }
            }
        );
    }

}
