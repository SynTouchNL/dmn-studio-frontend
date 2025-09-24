import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-unauthorized-view',
  imports: [],
  templateUrl: './unauthorized-view.html',
  styleUrl: './unauthorized-view.css'
})

export class UnauthorizedView implements OnInit {

    constructor(
        private titleService: Title
    ){}

    ngOnInit() {
        this.titleService.setTitle("DMN Tool - Geen toegang");
    }
}
