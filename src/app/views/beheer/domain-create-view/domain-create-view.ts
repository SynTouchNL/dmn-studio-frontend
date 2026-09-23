import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-domain-create-view',
    template: '<div class="container"><h3>Nieuw domein</h3><p>Hier komt het formulier om een domein aan te maken.</p></div>'
})
export class DomainCreateView {
    constructor(titleService: Title) {
        titleService.setTitle('DMNStudio - Nieuw domein');
    }
}
