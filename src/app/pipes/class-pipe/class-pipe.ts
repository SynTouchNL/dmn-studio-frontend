import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'classPipe'
})

export class ClassPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 0: // Nieuw
                return 'bg-success';
            case 1: // Concept
                return 'bg-danger';
            case 2: // Testen
                return 'bg-warning';
            case 3: // Goedkeuring
                return 'bg-dark';
            case 4: // Productie
                return 'bg-success';
            case 5: // Gearchiveerd
                return 'bg-secondary';
            // case "N/A": // N/A
            //     return 'bg-secondary';
            default: // Onbekend
                return 'bg-secondary';
        }
    }
}
