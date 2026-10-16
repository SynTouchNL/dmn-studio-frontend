import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ROLES } from '../../../auth';
import { EnvironmentInterface, EnvironmentRequest } from '../../interfaces/environments-interface';
import { AlertService } from '../../services/alert-service/alert-service';
import { HttpService } from '../../services/http-service/http-service';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';
import { apiErrorMessage } from '../../utils/api-error-message';

/** Same rule as the backend's @HttpUrl: absolute http(s), no credentials, query or fragment. */
const HTTP_URL_PATTERN = /^https?:\/\/[^\s/?#@]+(\/[^\s?#@]*)?$/i;

function trimmedRequired(control: AbstractControl<string>): ValidationErrors | null {
    return control.value.trim() ? null : { required: true };
}

function httpUrl(control: AbstractControl<string>): ValidationErrors | null {
    const value = control.value.trim();
    if (!value) return null;
    try {
        new URL(value);
    } catch {
        return { httpUrl: true };
    }
    return HTTP_URL_PATTERN.test(value) ? null : { httpUrl: true };
}

@Component({
    selector: 'app-environment-form-partial',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './environment-form-partial.html'
})
export class EnvironmentFormPartial implements OnInit {
    @Input({ required: true }) mode!: 'create' | 'edit';
    @Input() environment: EnvironmentInterface | null = null;

    readonly form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: [trimmedRequired, Validators.maxLength(255)] }),
        url: new FormControl('', { nonNullable: true, validators: [trimmedRequired, Validators.maxLength(2048), httpUrl] }),
        username: new FormControl('', { nonNullable: true, validators: [trimmedRequired, Validators.maxLength(255)] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(200)] }),
        active: new FormControl(true, { nonNullable: true })
    });

    isSubmitting = false;

    constructor(
        private readonly httpService: HttpService,
        private readonly keycloakService: KeycloakService,
        private readonly alertService: AlertService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        if (this.environment) {
            this.form.setValue({
                name: this.environment.name,
                url: this.environment.url ?? '',
                username: this.environment.username ?? '',
                password: '',
                active: this.environment.active
            });
        }

        // An empty password keeps the stored one, so it is only required when none is stored yet.
        if (!this.passwordStored) {
            this.form.controls.password.addValidators(trimmedRequired);
            this.form.controls.password.updateValueAndValidity();
        }

        if (this.environment && !this.environment.active) {
            this.updateReadOnlyState();
            this.form.controls.active.valueChanges.subscribe(() => this.updateReadOnlyState());
        }
    }

    get passwordStored(): boolean {
        return !!this.environment?.passwordSet;
    }

    get isReadOnly(): boolean {
        return !!this.environment && !this.environment.active && !this.form.controls.active.value;
    }

    get urlWithoutContextPath(): boolean {
        const control = this.form.controls.url;
        return control.valid && !!control.value.trim() && new URL(control.value.trim()).pathname.replace(/\/+$/, '') === '';
    }

    submit(): void {
        if (this.isReadOnly) return;

        for (const name of ['name', 'url', 'username'] as const) {
            this.form.controls[name].setValue(this.form.controls[name].value.trim());
        }
        this.form.markAllAsTouched();

        if (!this.keycloakService.hasAnyRole([ROLES.ADMIN]) ||
            (this.mode === 'edit' && !this.environment) ||
            this.form.invalid || this.isSubmitting) {
            return;
        }

        const data = this.form.getRawValue();
        const environmentRequest: EnvironmentRequest = {
            name: data.name,
            url: data.url,
            username: data.username,
            active: data.active
        };
        if (data.password.trim()) {
            environmentRequest.password = data.password;
        }

        let request: Observable<EnvironmentInterface>;
        if (this.mode === 'edit') {
            if (!this.environment) return;
            request = this.httpService.updateEnvironment(this.environment.id, environmentRequest);
        } else {
            request = this.httpService.createEnvironment(environmentRequest);
        }

        this.isSubmitting = true;
        request.subscribe({
            next: environment => {
                const created = this.mode === 'create';
                this.alertService.success(
                    created ? 'Omgeving aangemaakt' : 'Omgeving bijgewerkt',
                    `${environment.name} is ${created ? 'aangemaakt' : 'bijgewerkt'}.`
                );
                void this.router.navigate(['/omgevingen', environment.id]);
            },
            error: (error: HttpErrorResponse) => {
                this.isSubmitting = false;
                this.alertService.error(
                    this.mode === 'create' ? 'Omgeving aanmaken mislukt' : 'Omgeving bijwerken mislukt',
                    apiErrorMessage(error, {
                        forbidden: 'U heeft geen toestemming om deze omgeving te beheren.',
                        notFound: this.mode === 'edit' ? 'Deze omgeving bestaat niet meer.' : undefined,
                        fallback: this.mode === 'create'
                            ? 'Er is een fout opgetreden bij het aanmaken van de omgeving.'
                            : 'Er is een fout opgetreden bij het bijwerken van de omgeving.'
                    })
                );
            }
        });
    }

    private updateReadOnlyState(): void {
        for (const name of ['name', 'url', 'username', 'password'] as const) {
            if (this.isReadOnly) {
                this.form.controls[name].disable({ emitEvent: false });
            } else {
                this.form.controls[name].enable({ emitEvent: false });
            }
        }
    }}
