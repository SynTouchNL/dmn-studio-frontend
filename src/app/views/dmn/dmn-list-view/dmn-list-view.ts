import { Component, OnInit } from '@angular/core';
import { DmnListPartial } from '../../../partials/dmn-list-partial/dmn-list-partial';
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { DMNDomainInterface, DMNInterface } from '../../../interfaces/dmn-interface';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';

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
    dmnData: DMNInterface[] = [];
    domains: DMNDomainInterface[] = [];
    domain_selected: DMNDomainInterface | '' = '';
    myForm: any;

    constructor(
        private dmnService: DMNService,
        private titleService: Title,
        private FormBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.dmnService.getDMNs().subscribe(data => {
            this.dmnData = data;
        });

        this.dmnService.getDomains().subscribe(
            data => {
                this.domains = Array.isArray(data) ? data : [data];
            }
        );

        this.titleService.setTitle("DMN Tool - DMN Overzicht ");

        this.myForm = this.FormBuilder.group({
            domain: new FormControl(null),
            search: new FormControl(null)
        });

        this.myForm.get("domain").valueChanges.subscribe(
            (value: any[]) => {
                if (value !== null) {
                    this.dmnService.getDMNs().subscribe(
                        data => {
                            //@ts-ignore
                            this.dmnData = data.filter(dmn => dmn.domain.id === value.id);
                        }
                    )
                } else {
                    this.dmnService.getDMNs().subscribe(data => {
                        this.dmnData = data;
                    });
                }
            }
        );

        this.myForm.get("search").valueChanges.subscribe(
            (value: string) => {
                if (value && value.length > 0) {
                    this.dmnData = this.dmnData.filter(dmn => dmn.name.toLowerCase().includes(value.toLowerCase()));
                } else {
                    this.dmnService.getDMNs().subscribe(data => {
                        this.dmnData = data;
                    });
                }
            }
        )
    }
}
