import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EnvironmentFormPartial } from '../../../partials/environment-form-partial/environment-form-partial';

@Component({
    selector: 'app-environment-create-view',
    imports: [EnvironmentFormPartial],
    templateUrl: './environment-create-view.html'
})
export class EnvironmentCreateView {
    constructor(titleService: Title) {
        titleService.setTitle('DMNStudio - Nieuwe omgeving');
    }
}
