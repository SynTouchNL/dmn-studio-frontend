import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StatusPipe } from '../../pipes/status-pipe/status-pipe';
import { ClassPipe } from '../../pipes/class-pipe/class-pipe';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DMNVersionInterface } from '../../interfaces/dmn-interface';

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

export class DmnListPartial implements OnChanges {
    @Input() dmnList: any = [];  // incoming full list
    @Input() domains: boolean = false;
    @Input() filter: FormControl = new FormControl('');
    @Input() showDropdown: boolean = true;

    page = 1;
    pageSize = 10;
    collectionSize = 0;
    allDmnList: any[] = [];

    constructor() {}

    ngOnChanges() {
        this.allDmnList = this.dmnList; // store full dataset
        this.collectionSize = this.allDmnList.length;
        this.refreshDMNs();
    }

    refreshDMNs() {
        this.dmnList = this.allDmnList
            .map((dmn: any, i: number) => ({ id: i + 1, ...dmn }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize,
            );
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
}
