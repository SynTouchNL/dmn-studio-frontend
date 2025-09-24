import { Component, OnInit } from '@angular/core';
import { DmnListPartial } from '../../../partials/dmn-list-partial/dmn-list-partial';
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { DMNInterface } from '../../../interfaces/dmn-interface';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-dmn-list-view',
    imports: [
        DmnListPartial,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './dmn-list-view.html',
    styleUrl: './dmn-list-view.css',
    providers: [DecimalPipe]
})

export class DmnListView implements OnInit {
    filter = new FormControl('', { nonNullable: true });
    dmnData: DMNInterface[] = [];

    constructor(
        private dmnService: DMNService,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.dmnService.getDMNsByDomain(1).subscribe(data => {
            this.dmnData = data;
        });

        this.titleService.setTitle("DMN Tool - DMN Overzicht ");
    }
}
