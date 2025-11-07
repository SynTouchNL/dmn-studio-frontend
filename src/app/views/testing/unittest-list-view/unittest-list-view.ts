import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';
import { DMNInterface } from '../../../interfaces/dmn-interface';
import { DecisionVariables, Variable } from '../../../interfaces/decisions-interface';
import DmnModdle from 'dmn-moddle';
import camundaModdle from 'camunda-dmn-moddle/resources/camunda.json';

@Component({
  selector: 'app-unittest-list-view',
    imports: [
        RouterLink
    ],
  templateUrl: './unittest-list-view.html',
  styleUrl: './unittest-list-view.css'
})

export class UnittestListView implements OnInit {
    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnFile: string = "";
    dmnVars: DecisionVariables[] = [];
    dmnData: any = {};
    selectedDMN_naam: string = "";

    constructor
    (
        private activatedRoute: ActivatedRoute,
        private dmnService: HttpService,
        private router: Router
    )
    {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data ?? this.dmnData;
    }

    ngOnInit(){
        const snapshotId = this.activatedRoute.snapshot.paramMap.get('id');
        const snapshotVersion = this.activatedRoute.snapshot.paramMap.get('version');
        if (snapshotId) this.dmnId = +snapshotId;
        if (snapshotVersion) this.dmnVersion = +snapshotVersion;
        this.loadDMN();
    }

    loadDMN(){
        this.dmnService.getDMNFile(this.dmnId, this.dmnVersion).subscribe(async (data)  => {
            this.dmnVars = await this.parseDMNVariables(atob(data.fileBlob));
            this.dmnFile = atob(data.fileBlob);
            console.log(this.dmnVars);
        });
    }

    async parseDMNVariables(xml: string) {
        const model = new DmnModdle({camunda: camundaModdle});
        try {
            const {
                rootElement: definitions
            } = await model.fromXML(xml);
            console.log(definitions);
            this.selectedDMN_naam = definitions.name;
            const decisions = (definitions.drgElement || []).filter((d: any) => d.$type === 'dmn:InformationRequirement' ? false : d.$type === 'dmn:Decision');

            return decisions.map((decision: any) => {
                const incoming: Variable[] = [];
                (decision.informationRequirement || []).forEach((req: any) => {
                    const refName = req.requiredDecision?.name || req.requiredInput?.name;
                    if (refName) incoming.push({name: refName});
                });

                if (decision.decisionLogic?.input) {
                    decision.decisionLogic.input.forEach((input: any) => {
                        const name = input.inputVariable || input.label || input.id;
                        const typeRef = input.inputExpression?.typeRef;
                        const options: [] = input.inputValues?.text?.split?.(',') || [];
                        incoming.push({name: name, typeRef: typeRef, values: options});
                    });
                }

                const outgoing: Variable[] = [];
                if (decision.decisionLogic?.output) {
                    decision.decisionLogic.output.forEach((out: any) => {
                        const options: [] = out.outputValues?.text?.split?.(',') || [];
                        outgoing.push({name: out.name, typeRef: out.typeRef, values: options})
                    });
                } else if (decision.literalExpression?.variable) {
                    outgoing.push({
                        name: decision.literalExpression.variable.name,
                        typeRef: decision.literalExpression.variable.typeRef
                    });
                }
                return {
                    id: decision.id,
                    name: decision.name,
                    historyTimeToLive: decision.historyTimeToLive,
                    incoming,
                    outgoing
                };
            });
        } catch (e) {
            console.error('DMN moddle parse error:', e);
        }
    }
}
