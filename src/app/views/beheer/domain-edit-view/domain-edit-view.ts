import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DMNDomainInterface } from '../../../interfaces/domain-interface';
import { DomainFormPartial } from '../../../partials/domain-form-partial/domain-form-partial';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
    selector: 'app-domain-edit-view',
    imports: [DomainFormPartial, RouterLink],
    templateUrl: './domain-edit-view.html'
})
export class DomainEditView implements OnInit {
    domain: DMNDomainInterface | null = null;
    isLoadingDomain = true;
    domainLoadError = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly httpService: HttpService,
        private readonly titleService: Title
    ) {
        titleService.setTitle('DMNStudio - Domein bewerken');
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isSafeInteger(id) || id <= 0) {
            this.isLoadingDomain = false;
            this.domainLoadError = true;
            return;
        }

        this.httpService.getDomain(id).subscribe({
            next: domain => {
                if (!domain) {
                    this.domainLoadError = true;
                } else {
                    this.domain = domain;
                    this.titleService.setTitle(`DMNStudio - ${domain.name} bewerken`);
                }
                this.isLoadingDomain = false;
            },
            error: () => {
                this.domainLoadError = true;
                this.isLoadingDomain = false;
            }
        });
    }
}
