import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DomainFormPartial } from '../../../partials/domain-form-partial/domain-form-partial';

@Component({
    selector: 'app-domain-create-view',
    imports: [DomainFormPartial],
    templateUrl: './domain-create-view.html'
})
export class DomainCreateView {
    constructor(titleService: Title) {
        titleService.setTitle('DMNStudio - Nieuw domein');
    }
}
