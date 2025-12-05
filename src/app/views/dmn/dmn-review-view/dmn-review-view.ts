import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http-service/http-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {StatusPipe} from '../../../pipes/status-pipe/status-pipe';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClassPipe} from '../../../pipes/class-pipe/class-pipe';
import {KeycloakService} from '../../../services/keycloak-service/keycloak-service';
import {AlertService} from '../../../services/alert-service/alert-service';
import {KeycloakProfile} from 'keycloak-js';

@Component({
    selector: 'app-dmn-review-view',
    imports: [
        StatusPipe,
        DatePipe,
        ReactiveFormsModule,
        ClassPipe
    ],
    templateUrl: './dmn-review-view.html',
    styleUrl: './dmn-review-view.css'
})

export class DmnReviewView implements OnInit {
    dmnId: number = 0;
    dmnVersion: number = 0
    dmnData: any = {};
    changeData: any = {};
    myForm: any;
    show_comment: boolean = true;
    approved: boolean = false;
    comment: string = '';
    can_review: boolean = false;
    currentUser?: KeycloakProfile;

    constructor(
        private http: HttpService,
        private activatedRoute: ActivatedRoute,
        private title: Title,
        private router: Router,
        private formBuilder: FormBuilder,
        private keycloakService: KeycloakService,
        private alertService: AlertService
    )
    {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data || [];
        this.myForm = this.formBuilder.group({
            approved: new FormControl(null),
            comment: new FormControl(null)
        });
    }

    ngOnInit() {
        this.dmnId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.dmnVersion = Number(this.activatedRoute.snapshot.paramMap.get('version'));

        this.http.getReview(this.dmnId, this.dmnVersion).subscribe(
            {
                next: data => {
                    this.changeData = data;
                    this.keycloakService.getUserProfile().then(
                        profile => {
                            this.currentUser = profile;
                            if (profile.username == this.changeData.assignedTo){
                                this.can_review = true;
                            }
                        }
                    )
                },
                error: error => {
                    console.error('Error fetching review data:', error);
                }
            }
        )

        this.title.setTitle("DMNStudio - Nakijken - " + (this.dmnData.name || ''));



        this.myForm.get("approved").valueChanges.subscribe(
            (value: boolean) => {
                this.approved = value;
                this.show_comment = !value;
            }
        );

        this.myForm.get("comment").valueChanges.subscribe(
            (value: string) => {
                this.comment = value;
            }
        );
    }

    submitReview() {
        this.http.submitReview(this.dmnId, this.dmnVersion, this.changeData.id, this.approved).subscribe({
            next: data => {
                this.alertService.success("Review ingediend.", "De review is succesvol ingediend.");
                this.router.navigate([`/dmns/${this.dmnId}/${this.dmnVersion}`], { state: { data: data }})
            },
            error: error => {
                console.error('Error submitting review:', error);
            }
        });
    }

    clickOpen() {
        this.http.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
            data => {
                this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion +'/view'], {state: {id: data.id, version: data.version, status: data.status, file: atob(data.fileBlob)}})
            }
        )
    }

    clickCancel() {
        if(this.currentUser?.username == this.changeData.submittedBy){
            if (!confirm("Weet u zeker dat u deze review wilt annuleren? De DMN zal teruggezet worden naar Concept status.")){
                return;
            }
            this.http.cancelReview(this.dmnId, this.dmnVersion, this.changeData.id).subscribe({
                next: data => {
                    this.alertService.success('Review geannuleerd.', 'De DMN is teruggezet naar Concept status.');
                    this.router.navigate([`/dmns/${this.dmnId}/${this.dmnVersion}`], { state: { data: data }})
                },
                error: error => {
                    console.error('Error cancelling review:', error);
                }
            });
        } else {
            this.alertService.warning("U kunt geen review annuleren die niet door u is ingediend.", "Geen toestemming");
        }
    }
}
