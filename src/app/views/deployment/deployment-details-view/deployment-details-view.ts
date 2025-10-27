import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { DeploymentsInterface } from '../../../interfaces/deployments-interface';
import { ClassPipe } from '../../../pipes/class-pipe/class-pipe';
import { StatusPipe } from '../../../pipes/status-pipe/status-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-deployment-details-view',
    imports: [
        RouterLink,
        ClassPipe,
        StatusPipe,
        DatePipe
    ],
  templateUrl: './deployment-details-view.html',
  styleUrl: './deployment-details-view.css'
})

export class DeploymentDetailsView implements OnInit {
    deploymentData: DeploymentsInterface[] = [];
    private activatedRoute = inject(ActivatedRoute);
    // deploymentDetails: any[] = []; // TODO: Implement als hier nog meerwaarde in komt, momenteel niet.

    constructor(
        private dmnService: DMNService,
        private router: Router
    ) {}

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params) => {
                if (typeof +params['id'] == 'number'){
                    this.dmnService.getDeploymentDetails(+params['id']).subscribe(
                        data => {
                            this.deploymentData = Array.isArray(data) ? data : [data];
                            // this.dmnService.getOperatonDetails(this.deploymentData[0].deploymentRef).subscribe(
                            //     d => {
                            //         console.log(d)
                            //         this.deploymentDetails = d;
                            //     }
                            // )
                        }
                    )
                }
            }
        );
    }

    clickOpen() {
        this.router.navigate([`/dmns/${this.deploymentData[0].dmnId}/${this.deploymentData[0].dmnVersion.version}`])
    }
}
