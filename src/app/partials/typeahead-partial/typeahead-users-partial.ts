import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { UserInterface } from '../../interfaces/user-interface';
import { HttpService } from '../../services/http-service/http-service';

@Component({
    selector: 'app-typeahead-users-partial',
    imports: [FormsModule, NgbTypeaheadModule],
    templateUrl: './typeahead-users-partial.html',
    styleUrl: './typeahead-users-partial.css'
})
export class TypeaheadUsersPartial implements OnChanges {
    @Input() title = '';
    @Input() initialUser?: Partial<UserInterface>;
    @Output() selected = new EventEmitter<UserInterface>();
    model: any = '';
    selectedUser?: UserInterface;

    constructor(private httpService: HttpService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['initialUser'] && this.initialUser && !this.selectedUser) {
            this.model = this.initialUser;
        }
    }

    formatter = (user: any) => user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';

    search: OperatorFunction<string, readonly UserInterface[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term =>
                term.length < 2
                    ? of([])
                    : this.httpService.searchUsers(term).pipe(catchError(() => of([])))
            )
        );

    onUserSelected(event: any) {
        this.selectedUser = event.item;
        this.selected.emit(this.selectedUser);
    }
}
