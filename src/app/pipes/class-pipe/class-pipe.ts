import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'classPipe'
})

export class ClassPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 0: // Nieuw
                return 'bg-success-subtle text-success-emphasis';
            case 1: // Concept
                return 'bg-secondary-subtle text-secondary-emphasis';
            case 2: // Testen
                return 'bg-warning-subtle text-warning-emphasis';
            case 3: // Goedkeuring
                return 'bg-primary-subtle text-primary-emphasis';
            case 4: // Productie
                return 'bg-success-subtle text-success-emphasis';
            case 5: // Gearchiveerd
                return 'bg-secondary-subtle text-secondary-emphasis';
            default: // Onbekend
                return 'bg-secondary-subtle text-secondary-emphasis';
        }
    }
}
