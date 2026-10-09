import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROLES } from '../../../../auth';
import { DMNDomainInterface } from '../../../interfaces/domain-interface';
import { AlertService } from '../../../services/alert-service/alert-service';
import { HttpService } from '../../../services/http-service/http-service';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';
import { apiErrorMessage } from '../../../utils/api-error-message';

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
        this.alertService.error('Domein verwijderen mislukt', apiErrorMessage(error, {
          forbidden: 'U heeft geen toestemming om dit domein te verwijderen.',
          notFound: 'Dit domein bestaat niet meer.',
          fallback: 'Er is een fout opgetreden bij het verwijderen van het domein.'
        }));
      }
    });
  }}
