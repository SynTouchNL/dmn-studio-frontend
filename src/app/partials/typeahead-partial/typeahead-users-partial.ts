import {Component, EventEmitter, Input, Output} from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import {UserInterface} from '../../interfaces/user-interface';
import {JsonPipe} from '@angular/common';

@Component({
    selector: 'app-typeahead-users-partial',
    imports: [
        FormsModule,
        NgbTypeaheadModule
    ],
    templateUrl: './typeahead-users-partial.html',
    styleUrl: './typeahead-users-partial.css'
})

export class TypeaheadUsersPartial {
    @Input() title = '';
    @Input() data: UserInterface[] = [];
    @Output() selected = new EventEmitter<UserInterface>();
    model: any = '';

    selectedUser?: UserInterface

    constructor() {
    }

    formatter = (user: any) => user ? `${user.firstName} ${user.lastName}` : '';

    search: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term =>
            term.length < 2 ? [] : this.data.filter(v => {
                const full = `${v.firstName} ${v.lastName}`.toLowerCase();
                return full.includes(term.toLowerCase());
            }).slice(0, 10)
        )
    );

    onUserSelected(event: any) {
        this.selectedUser = event.item; // full object
        this.selected.emit(this.selectedUser); // 🔹 emit to parent
    }

}
