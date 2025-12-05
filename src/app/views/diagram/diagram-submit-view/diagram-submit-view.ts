import {Component, OnInit} from '@angular/core';
import { HttpService } from '../../../services/http-service/http-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert-service/alert-service';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EnvironmentsInterface} from '../../../interfaces/environments-interface';

@Component({
    selector: 'app-diagram-submit-view',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './diagram-submit-view.html',
    styleUrl: './diagram-submit-view.css'
})
export class DiagramSubmitView implements OnInit {
    reviewer: string = '';
    dmnVersion: number = 0;
    dmnId: number = 0;
    description: string = '';
    myForm: any;

    constructor(
        private http: HttpService,
        private activatedRoute: ActivatedRoute,
        private alertService: AlertService,
        private router: Router,
        private title: Title,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(){
        this.dmnId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.dmnVersion = Number(this.activatedRoute.snapshot.paramMap.get('version'));
        this.title.setTitle("DMNStudio - Wijziging indienen");
        this.myForm = this.formBuilder.group({
            description: new FormControl(null),
            reviewer: new FormControl(null)
        });

        this.myForm.get("description").valueChanges.subscribe(
            (value: string) => {
                this.description = value;
            }
        );

        this.myForm.get("reviewer").valueChanges.subscribe(
            (value: string) => {
                this.reviewer = value;
            }
        );
    }

    handInChanges(){
        this.http.submitForReview(this.dmnId, this.dmnVersion, this.description, this.reviewer).subscribe({
            next: data => {
                this.alertService.success('Nieuwe wijziging ingediend voor review.', 'De wijziging is succesvol ingediend en zal worden beoordeeld door de aangewezen reviewer.');
                this.router.navigate([`/dmns/${this.dmnId}/${this.dmnVersion}`], { state: { data: data }})
            },
            error: error => {
                if (error.status === 400) {
                    this.alertService.error('Fout bij het indienen van de wijzigingen.', 'Alleen diagrammen met status Concept en Testing mogen ingediend worden!');
                }
            }
        });
    }

}
