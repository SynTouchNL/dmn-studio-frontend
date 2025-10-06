import {AfterViewInit, Component, Input, OnChanges, PipeTransform} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {DatePipe} from '@angular/common';
import { StatusPipe } from '../../pipes/status-pipe/status-pipe';
import { ClassPipe } from '../../pipes/class-pipe/class-pipe';
import {FormControl, FormsModule} from '@angular/forms';
import {NgbHighlight, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {VersionInterface} from '../../interfaces/version-interface';

@Component({
    selector: 'app-dmn-list-partial',
    imports: [
        RouterLink,
        DatePipe,
        StatusPipe,
        ClassPipe,
        FormsModule,
        NgbPagination,
    ],
    templateUrl: './dmn-list-partial.html',
    styleUrl: './dmn-list-partial.css',
    providers: []
})

export class DmnListPartial implements AfterViewInit {
    @Input() dmnList: any = [];  // incoming full list
    @Input() domains: boolean = false;
    @Input() filter: FormControl = new FormControl('');

    constructor() {
    }

    page = 1;
    pageSize = 10;
    collectionSize = 0;
    allDmnList: any[] = [];

    ngOnChanges() {
        this.allDmnList = this.dmnList; // store full dataset
        this.collectionSize = this.allDmnList.length;
        this.refreshDMNs();
    }

    ngAfterViewInit() {
    }

    refreshDMNs() {
        this.dmnList = this.allDmnList
            .map((dmn: any, i: number) => ({ id: i + 1, ...dmn }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize,
            );
    }

    findLatest(versions: VersionInterface[]): VersionInterface {
        const prodStatus = 4;
        // Try exact match first
        const exact = versions.find(v => v.status === prodStatus);
        if (exact) return exact;

        // Otherwise, go down from targetStatus - 1 until 1
        for (let s = prodStatus - 1; s >= 1; s--) {
            const found = versions.find(v => v.status === s);
            if (found) return found;
        }

        // If none of 4..1 exist, just return the first version as fallback
        return versions[0];
    }
}
