import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertInterface } from '../../interfaces/alert-interface';

@Injectable({
    providedIn: 'root'
})

export class AlertService {
    private alertSubject = new Subject<AlertInterface>();
    alerts$ = this.alertSubject.asObservable();

    success(title: string, text: string) {
        this.alertSubject.next({ type: 'success', title, text });
    }

    warning(title: string, text: string) {
        this.alertSubject.next({ type: 'warning', title, text });
    }

    error(title: string, text: string) {
        this.alertSubject.next({ type: 'danger', title, text });
    }
}
