import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnvironmentInterface } from '../../../interfaces/environments-interface';
import { EnvironmentFormPartial } from '../../../partials/environment-form-partial/environment-form-partial';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
    selector: 'app-environment-edit-view',
    imports: [EnvironmentFormPartial, RouterLink],
    templateUrl: './environment-edit-view.html'
})
export class EnvironmentEditView implements OnInit {
    environment: EnvironmentInterface | null = null;
    isLoadingEnvironment = true;
    environmentLoadError = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly httpService: HttpService,
        private readonly titleService: Title
    ) {
        titleService.setTitle('DMNStudio - Omgeving bewerken');
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isSafeInteger(id) || id <= 0) {
            this.isLoadingEnvironment = false;
            this.environmentLoadError = true;
            return;
        }

        this.httpService.getEnvironment(id).subscribe({
            next: environment => {
                if (!environment) {
                    this.environmentLoadError = true;
                } else {
                    this.environment = environment;
                    this.titleService.setTitle(`DMNStudio - ${environment.name} bewerken`);
                }
                this.isLoadingEnvironment = false;
            },
            error: () => {
                this.environmentLoadError = true;
                this.isLoadingEnvironment = false;
            }
        });
    }
}
