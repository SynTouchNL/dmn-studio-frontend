import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
  selector: 'app-unittest-detail-view',
    imports: [
        RouterLink
    ],
  templateUrl: './unittest-detail-view.html',
  styleUrl: './unittest-detail-view.css'
})

export class UnittestDetailView implements OnInit {

    dmnData: any = {};
    testData: any = {};

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: HttpService
    ) {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data ?? this.dmnData;
        console.log(navState.data);
    }

    ngOnInit(){
        const snapshotId = this.activatedRoute.snapshot.paramMap.get('id');
        const snapshotVersion = this.activatedRoute.snapshot.paramMap.get('version');
        if (snapshotId && snapshotVersion) {
            this.http.getTests(+snapshotId, +snapshotVersion).subscribe(
                data => {
                    this.testData = data || [];
                }
            );
        }
    }
}
