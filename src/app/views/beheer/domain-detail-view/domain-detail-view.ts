import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROLES } from '../../../../auth';
import { ApiErrorResponse } from '../../../interfaces/api-error-response-interface';
import { DMNDomainInterface } from '../../../interfaces/domain-interface';
import { AlertService } from '../../../services/alert-service/alert-service';
import { HttpService } from '../../../services/http-service/http-service';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';

@Component({
  selector: 'app-domain-detail-view',
  imports: [DatePipe, RouterLink],
  templateUrl: './domain-detail-view.html'
})
export class DomainDetailView implements OnInit {
  domain: DMNDomainInterface | null = null;
  isLoading = true;
  loadError = false;
  isDeleting = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly httpService: HttpService,
    private readonly keycloakService: KeycloakService,
    private readonly alertService: AlertService,
    private readonly titleService: Title
  ) {
    this.titleService.setTitle('DMNStudio - Domein');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }

    this.httpService.getDomain(id).subscribe({
      next: domain => {
        this.domain = domain;
        this.titleService.setTitle(`DMNStudio - ${domain.name}`);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }

  get canManage(): boolean {
    return this.keycloakService.hasAnyRole([ROLES.ADMIN]);
  }

  deleteDomain(): void {
    if (!this.canManage || !this.domain || this.isDeleting) {
      return;
    }

    const domain = this.domain;
    if (!confirm(`Weet u zeker dat u het domein "${domain.name}" wilt verwijderen?`)) {
      return;
    }

    this.isDeleting = true;
    this.httpService.deleteDomain(domain.id).subscribe({
      next: () => {
        this.alertService.success('Domein verwijderd', `${domain.name} is verwijderd.`);
        void this.router.navigate(['/domeinen']);
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting = false;
        this.alertService.error('Domein verwijderen mislukt', this.deleteErrorMessage(error));
      }
    });
  }

  private deleteErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'De server is niet bereikbaar. Probeer het later opnieuw.';
    }

    const response = error.error as Partial<ApiErrorResponse> | null;
    const message = typeof response?.message === 'string' && response.message.trim()
      ? response.message.trim()
      : error.status === 403
        ? 'U heeft geen toestemming om dit domein te verwijderen.'
        : error.status === 404
          ? 'Dit domein bestaat niet meer.'
          : 'Er is een fout opgetreden bij het verwijderen van het domein.';


    return message;
  }
}
