import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ROLES } from '../../../auth';
import { ApiErrorResponse } from '../../interfaces/api-error-response-interface';
import { DMNDomainInterface } from '../../interfaces/domain-interface';
import { UserInterface } from '../../interfaces/user-interface';
import { AlertService } from '../../services/alert-service/alert-service';
import { HttpService } from '../../services/http-service/http-service';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';

@Component({
    selector: 'app-domain-form-partial',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './domain-form-partial.html'
})
export class DomainFormPartial implements OnInit {
    @Input({ required: true }) mode!: 'create' | 'edit';
    @Input() domain: DMNDomainInterface | null = null;

    readonly form = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [
                control => control.value.trim() ? null : { required: true },
                Validators.maxLength(45)
            ]
        }),
        ownerId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        active: new FormControl(true, { nonNullable: true })
    });

    users: UserInterface[] = [];
    isLoadingUsers = true;
    usersLoadError = false;
    isSubmitting = false;

    constructor(
        private readonly httpService: HttpService,
        private readonly keycloakService: KeycloakService,
        private readonly alertService: AlertService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        if (this.domain) {
            this.form.setValue({
                name: this.domain.name,
                ownerId: this.domain.ownerId,
                active: this.domain.active
            });
        }
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoadingUsers = true;
        this.usersLoadError = false;
        this.httpService.getUsers().subscribe({
            next: users => {
                this.users = Array.isArray(users) ? users : [];
                this.isLoadingUsers = false;
            },
            error: () => {
                this.users = [];
                this.usersLoadError = true;
                this.isLoadingUsers = false;
            }
        });
    }

    get ownerMissing(): boolean {
        return !!this.domain && !this.users.some(user => user.id === this.domain?.ownerId);
    }

    userLabel(user: UserInterface): string {
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
        const identifier = user.username || user.email || user.id;
        return name ? `${name} (${identifier})` : identifier;
    }

    submit(): void {
        this.form.controls.name.setValue(this.form.controls.name.value.trim());
        this.form.markAllAsTouched();

        if (!this.keycloakService.hasAnyRole([ROLES.ADMIN]) ||
            (this.mode === 'edit' && !this.domain) ||
            this.form.invalid || this.isLoadingUsers || this.isSubmitting) {
            return;
        }

        const data = this.form.getRawValue();
        if (!this.users.some(user => user.id === data.ownerId) && data.ownerId !== this.domain?.ownerId) {
            this.form.controls.ownerId.setErrors({ required: true });
            return;
        }

        let request: Observable<void>;
        let destination: (string | number)[];
        if (this.mode === 'edit') {
            if (!this.domain) return;
            request = this.httpService.updateDomain(this.domain.id, data);
            destination = ['/domeinen', this.domain.id];
        } else {
            request = this.httpService.createDomain(data);
            destination = ['/domeinen'];
        }

        this.isSubmitting = true;
        request.subscribe({
            next: () => {
                const created = this.mode === 'create';
                this.alertService.success(
                    created ? 'Domein aangemaakt' : 'Domein bijgewerkt',
                    `${data.name} is ${created ? 'aangemaakt' : 'bijgewerkt'}.`
                );
                void this.router.navigate(destination);
            },
            error: (error: HttpErrorResponse) => {
                this.isSubmitting = false;
                this.alertService.error(
                    this.mode === 'create' ? 'Domein aanmaken mislukt' : 'Domein bijwerken mislukt',
                    this.errorMessage(error)
                );
            }
        });
    }

    private errorMessage(error: HttpErrorResponse): string {
        if (error.status === 0) {
            return 'De server is niet bereikbaar. Probeer het later opnieuw.';
        }

        const response = error.error as Partial<ApiErrorResponse> | null;
        const message = typeof response?.message === 'string' && response.message.trim()
            ? response.message.trim()
            : error.status === 403
                ? 'U heeft geen toestemming om dit domein te beheren.'
                : error.status === 404 && this.mode === 'edit'
                    ? 'Dit domein bestaat niet meer.'
                    : this.mode === 'create'
                        ? 'Er is een fout opgetreden bij het aanmaken van het domein.'
                        : 'Er is een fout opgetreden bij het bijwerken van het domein.';
        const violations = Array.isArray(response?.violations)
            ? response.violations
                .filter(violation => typeof violation?.field === 'string' && typeof violation?.message === 'string')
                .map(violation => `${violation.field}: ${violation.message}`)
            : [];

        return [message, ...violations].join(' ');
    }
}
