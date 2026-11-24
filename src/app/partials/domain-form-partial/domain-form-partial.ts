import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ROLES } from '../../../auth';
import { DMNDomainInterface } from '../../interfaces/domain-interface';
import { UserInterface } from '../../interfaces/user-interface';
import { AlertService } from '../../services/alert-service/alert-service';
import { HttpService } from '../../services/http-service/http-service';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';
import { apiErrorMessage } from '../../utils/api-error-message';
import { TypeaheadUsersPartial } from '../typeahead-partial/typeahead-users-partial';

@Component({
    selector: 'app-domain-form-partial',
    imports: [ReactiveFormsModule, RouterLink, TypeaheadUsersPartial],
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

    isSubmitting = false;
    private defaultOwner?: Partial<UserInterface>;

    get initialOwner(): Partial<UserInterface> | undefined {
        if (this.domain?.ownerId) {
            return { id: this.domain.ownerId, firstName: this.domain.owner || this.domain.ownerId };
        }
        return this.defaultOwner;
    }

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
        } else {
            this.defaultOwner = this.keycloakService.getCurrentUser();
            this.form.controls.ownerId.setValue(this.defaultOwner.id ?? '');
        }
    }

    onOwnerSelected(user: UserInterface): void {
        this.form.controls.ownerId.setValue(user.id ?? '');
        this.form.controls.ownerId.markAsTouched();
    }

    submit(): void {
        this.form.controls.name.setValue(this.form.controls.name.value.trim());
        this.form.markAllAsTouched();

        if (!this.keycloakService.hasAnyRole([ROLES.ADMIN]) ||
            (this.mode === 'edit' && !this.domain) ||
            this.form.invalid || this.isSubmitting) {
            return;
        }

        const data = this.form.getRawValue();
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
                    apiErrorMessage(error, {
                        forbidden: 'U heeft geen toestemming om dit domein te beheren.',
                        notFound: this.mode === 'edit' ? 'Dit domein bestaat niet meer.' : undefined,
                        fallback: this.mode === 'create'
                            ? 'Er is een fout opgetreden bij het aanmaken van het domein.'
                            : 'Er is een fout opgetreden bij het bijwerken van het domein.'
                    })
                );
            }
        });
    }}
