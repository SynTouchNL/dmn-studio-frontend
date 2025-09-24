import { Component } from '@angular/core';
import { AlertInterface } from '../../interfaces/alert-interface';
import { AlertService } from '../../services/alert-service/alert-service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-partial',
  imports: [
      NgbAlert
  ],
  templateUrl: './alert-partial.html',
  styleUrl: './alert-partial.css'
})
export class AlertPartial implements OnInit {
    alert: AlertInterface | null = null;

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        this.alertService.alerts$.subscribe(alert => {
            this.alert = alert;
        });
    }

    close() {
        this.alert = null;
    }
}
