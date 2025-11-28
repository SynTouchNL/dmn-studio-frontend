import {Component, OnInit} from '@angular/core';
import { DmnListPartial } from '../../../partials/dmn-list-partial/dmn-list-partial';
import { HttpService } from '../../../services/http-service/http-service';
import { DMNInterface } from '../../../interfaces/dmn-interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index-view',
    imports: [
        DmnListPartial
    ],
  templateUrl: './index-view.html',
  styleUrl: './index-view.css'
})

export class IndexView implements OnInit {
    dmnData: DMNInterface[] = [];

    constructor(
        private dmnService: HttpService,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.dmnService.getDMNs().subscribe(data => {
            this.dmnData = data;
        });

        this.titleService.setTitle("DMNStudio - Homepagina");
    }
}
