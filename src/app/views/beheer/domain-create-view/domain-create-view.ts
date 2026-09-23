import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ApiErrorResponse } from '../../../interfaces/api-error-response-interface';
import { UserInterface } from '../../../interfaces/user-interface';
import { AlertService } from '../../../services/alert-service/alert-service';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
    selector: 'app-domain-create-view',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './domain-create-view.html'
})
export class DomainCreateView implements OnInit {
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
        private readonly alertService: AlertService,
        private readonly router: Router,
        private readonly titleService: Title
    ) {
        titleService.setTitle('DMNStudio - Nieuw domein');
    }

    ngOnInit(): void {
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

    userLabel(user: UserInterface): string {
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
        const identifier = user.username || user.email || user.id;
        return name ? `${name} (${identifier})` : identifier;
    }

    submit(): void {
        this.form.controls.name.setValue(this.form.controls.name.value.trim());
        this.form.markAllAsTouched();

        if (this.form.invalid || this.isLoadingUsers || this.usersLoadError || this.isSubmitting) {
            return;
        }

        const domain = this.form.getRawValue();
        if (!this.users.some(user => user.id === domain.ownerId)) {
            this.form.controls.ownerId.setErrors({ required: true });
            return;
        }

        this.isSubmitting = true;
        this.httpService.createDomain(domain).subscribe({
            next: () => {
                this.alertService.success('Domein aangemaakt', `${domain.name} is aangemaakt.`);
                void this.router.navigate(['/domeinen']);
            },
            error: (error: HttpErrorResponse) => {
                this.isSubmitting = false;
                this.alertService.error('Domein aanmaken mislukt', this.createErrorMessage(error));
            }
        });
    }

    private createErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 0) {
            return 'De server is niet bereikbaar. Probeer het later opnieuw.';
        }

        const response = error.error as Partial<ApiErrorResponse> | null;
        const message = typeof response?.message === 'string' && response.message.trim()
            ? response.message.trim()
            : 'Er is een fout opgetreden bij het aanmaken van het domein.';
        const violations = Array.isArray(response?.violations)
            ? response.violations
                .filter(violation => typeof violation?.field === 'string' && typeof violation?.message === 'string')
                .map(violation => `${violation.field}: ${violation.message}`)
            : [];

        return [message, ...violations].join(' ');
    }
}
