import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http-service/http-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {StatusPipe} from '../../../pipes/status-pipe/status-pipe';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClassPipe} from '../../../pipes/class-pipe/class-pipe';

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

    constructor(
        private http: HttpService,
        private activatedRoute: ActivatedRoute,
        private title: Title,
        private router: Router,
        private formBuilder: FormBuilder
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
        console.log('Submitting review for DMN ID:', this.dmnId, 'Version:', this.dmnVersion, 'Approved:', this.approved, 'Comment:', this.comment);
        this.http.submitReview(this.dmnId, this.dmnVersion, this.changeData.id, this.approved, this.comment).subscribe({
            next: data => {
                this.router.navigate([`/dmns/${this.dmnId}/${this.dmnVersion}`], { state: { data: data }})
            },
            error: error => {
                console.error('Error submitting review:', error);
            }
        });
    }

}
