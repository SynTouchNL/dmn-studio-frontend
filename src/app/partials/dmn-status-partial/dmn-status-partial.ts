import { Component, Input, OnChanges } from '@angular/core';
import { DMNVersionInterface } from '../../interfaces/dmn-interface';

@Component({
  selector: 'app-dmn-status-partial',
  imports: [],
  templateUrl: './dmn-status-partial.html',
  styleUrl: './dmn-status-partial.css'
})
export class DmnStatusPartial implements OnChanges {
    @Input() data!: DMNVersionInterface;

    constructor() {}

    badges: {
        key: string,
        tooltip: string,
        label: string,
        active: boolean
    }[] = [];

    ngOnChanges() {
        this.badges = [
            {
                key: 'version',
                tooltip: `v${this.data.version-1}`,
                label: `v${this.data.version-1}`,
                active: this.data.status >= 0
            },
            {
                key: 'concept',
                tooltip: 'Concept',
                label: 'C',
                active: this.data.status >= 1
            },
            {
                key: 'approval',
                tooltip: 'Goedkeuring',
                label: 'G',
                active: this.data.status >= 3
            },
            {
                key: 'production',
                tooltip: 'Productie',
                label: `v${this.data.version}`,
                active: this.data.status >= 4
            },
            {
                key: 'archived',
                tooltip: 'Gearchiveerd',
                label: `A`,
                active: this.data.status >= 5
            }
        ];
    }

    trackByBadge(index: number, badge: any) {
        return index;
    }
}
