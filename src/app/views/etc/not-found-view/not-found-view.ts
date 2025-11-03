import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found-view',
  imports: [],
  templateUrl: './not-found-view.html',
  styleUrl: './not-found-view.css'
})

export class NotFoundView implements OnInit{

    constructor(
        private titleService: Title
    ){}

    ngOnInit() {
        this.titleService.setTitle("DMN Tool - 404");
    }
}
