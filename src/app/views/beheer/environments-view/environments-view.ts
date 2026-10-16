import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ROLES } from '../../../../auth';
import { EnvironmentInterface } from '../../../interfaces/environments-interface';
import { HttpService } from '../../../services/http-service/http-service';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';

@Component({
  selector: 'app-environments-view',
  imports: [DatePipe, RouterLink],
  templateUrl: './environments-view.html'
})
export class EnvironmentsView implements OnInit {
  environments: EnvironmentInterface[] = [];
  isLoading = true;
  loadError = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly keycloakService: KeycloakService,
    private readonly titleService: Title
  ) {
    titleService.setTitle('DMNStudio - Omgevingen');
  }

  ngOnInit(): void {
    this.loadEnvironments();
  }

  get canManage(): boolean {
    return this.keycloakService.hasAnyRole([ROLES.ADMIN]);
  }

  needsConfiguration(environment: EnvironmentInterface): boolean {
    return !environment.url || !environment.username || !environment.passwordSet;
  }

  loadEnvironments(): void {
    this.environments = [];
    this.isLoading = true;
    this.loadError = false;

    this.httpService.getEnvironments().subscribe({
      next: environments => {
        this.environments = Array.isArray(environments) ? environments : [];
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }
}
