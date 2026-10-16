import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROLES } from '../../../../auth';
import { ConnectionTestResult, EnvironmentInterface } from '../../../interfaces/environments-interface';
import { ClassPipe } from '../../../pipes/class-pipe/class-pipe';
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { AlertService } from '../../../services/alert-service/alert-service';
import { HttpService } from '../../../services/http-service/http-service';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';
import { apiErrorMessage } from '../../../utils/api-error-message';

@Component({
  selector: 'app-environment-detail-view',
  imports: [DatePipe, RouterLink, ClassPipe, StatusPipe],
  templateUrl: './environment-detail-view.html'
})
export class EnvironmentDetailView implements OnInit {
  environment: EnvironmentInterface | null = null;
  isLoading = true;
  loadError = false;
  isDeleting = false;
  isTesting = false;
  testResult: ConnectionTestResult | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly httpService: HttpService,
    private readonly keycloakService: KeycloakService,
    private readonly alertService: AlertService,
    private readonly titleService: Title
  ) {
    this.titleService.setTitle('DMNStudio - Omgeving');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }

    this.httpService.getEnvironment(id).subscribe({
      next: environment => {
        this.environment = environment;
        this.titleService.setTitle(`DMNStudio - ${environment.name}`);
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

  get needsConfiguration(): boolean {
    return !!this.environment && (!this.environment.url || !this.environment.username || !this.environment.passwordSet);
  }

  testConnection(): void {
    if (!this.canManage || !this.environment || this.isTesting) {
      return;
    }

    this.isTesting = true;
    this.testResult = null;
    this.httpService.testEnvironmentConnection(this.environment.id).subscribe({
      next: result => {
        this.testResult = result;
        this.isTesting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isTesting = false;
        this.alertService.error('Verbinding testen mislukt', apiErrorMessage(error, {
          forbidden: 'U heeft geen toestemming om deze omgeving te testen.',
          notFound: 'Deze omgeving bestaat niet meer.',
          fallback: 'Er is een fout opgetreden bij het testen van de verbinding.'
        }));
      }
    });
  }

  deleteEnvironment(): void {
    if (!this.canManage || !this.environment || this.isDeleting) {
      return;
    }

    const environment = this.environment;
    const deploymentCount = environment.deployments.length;
    const warning = deploymentCount > 0
      ? `\n\n${deploymentCount} deployment(s) blijven bestaan zonder omgeving en kunnen daarna niet meer vanuit DMNStudio worden verwijderd. Er wordt niets verwijderd uit de engine.`
      : '\n\nEr wordt niets verwijderd uit de engine.';
    if (!confirm(`Weet u zeker dat u de omgeving "${environment.name}" wilt verwijderen?${warning}`)) {
      return;
    }

    this.isDeleting = true;
    this.httpService.deleteEnvironment(environment.id).subscribe({
      next: () => {
        this.alertService.success('Omgeving verwijderd', `${environment.name} is verwijderd.`);
        void this.router.navigate(['/omgevingen']);
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting = false;
        this.alertService.error('Omgeving verwijderen mislukt', apiErrorMessage(error, {
          forbidden: 'U heeft geen toestemming om deze omgeving te verwijderen.',
          notFound: 'Deze omgeving bestaat niet meer.',
          fallback: 'Er is een fout opgetreden bij het verwijderen van de omgeving.'
        }));
      }
    });
  }}
