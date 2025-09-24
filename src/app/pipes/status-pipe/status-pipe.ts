import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusPipe'
})

export class StatusPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 0:
                return 'Nieuw';
            case 1:
                return 'Concept';
            case 2:
                return 'Testen';
            case 3:
                return 'Goedkeuring';
            case 4:
                return 'Productie';
            case 5:
                return 'Gearchiveerd';
            default:
                return 'Onbekend';
        }
    }
}
