import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs-partial',
    imports: [
        RouterLink
    ],
  templateUrl: './breadcrumbs-partial.html',
  styleUrl: './breadcrumbs-partial.css'
})

export class BreadcrumbsPartial {
  @Input() breadcrumbs: { label: string; url: string }[] = [];

}
