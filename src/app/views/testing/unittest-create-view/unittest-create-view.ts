import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule, Validators,
} from '@angular/forms';
import { DecisionVariables, UnitTestPayload } from '../../../interfaces/decisions-interface';
import { Title} from '@angular/platform-browser';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { KeyPairForm } from '../../../partials/key-pair-form/key-pair-form';
import { BreadcrumbsPartial } from '../../../partials/breadcrumbs-partial/breadcrumbs-partial';
import { AlertService } from '../../../services/alert-service/alert-service';
import {parseJson} from '@angular/cli/src/utilities/json-file';

@Component({
    selector: 'app-unittest-create-view',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbNavOutlet,
        NgbNav,
        NgbNavContent,
        NgbNavLinkButton,
        NgbNavItem,
        KeyPairForm,
        BreadcrumbsPartial
    ],
    templateUrl: './unittest-create-view.html',
    styleUrl: './unittest-create-view.css'
})

export class UnittestCreateView implements OnInit {
    dmnData: DecisionVariables;
    form: FormGroup;
    dmnId: number = 0;
    dmnVersion: number = 0;
    breadcrumb: { label: string, url: string, current: boolean }[] = [];

    imported_vars: any = {};

    hasResult: boolean = false;
    actualResult: any = null;
    expectedResult: any = null;
    resultStatus: boolean = false;

    constructor(
        private router: Router,
        private http: HttpService,
        private formBuilder: FormBuilder,
        private titleService: Title,
        private activatedRoute: ActivatedRoute
    ) {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data || [];

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            inputPairs: this.formBuilder.array([], Validators.required),
            outputPairs: this.formBuilder.array([], Validators.required),
        });

        if (navState.fresh !== true){
            this.imported_vars = navState.import || {};
            this.importVariables(this.imported_vars);
        }
    }

    ngOnInit(){
        this.dmnId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.dmnVersion = Number(this.activatedRoute.snapshot.paramMap.get('version'));
        this.titleService.setTitle("DMNStudio - Test aanmaken ");
        this.breadcrumb = [
            { label: 'DMN-overzicht', url:'/dmns', current: false },
            { label: 'DMN details', url:'/dmns/' + this.dmnId + '/' + this.dmnVersion, current: false },
            { label: this.dmnData?.name + ' details', url:'/dmns/' + this.dmnId + '/' + this.dmnVersion + '/test/view', current: true }
        ]
    }

    get inputPairs() { return this.form.get('inputPairs') as FormArray; }
    get outputPairs() { return this.form.get('outputPairs') as FormArray; }
    get title() { return this.form?.get('title'); }

    importVariables(input: any) {
        input.values.forEach((inputVar: any) => {
            if (inputVar.isInput) {
                this.inputPairs.push(this.formBuilder.group({
                    key: [inputVar.key, Validators.required],
                    value: [inputVar.value, Validators.required],
                    typeRef: [inputVar.valueType, Validators.required]
                }));
            } else {
                this.outputPairs.push(this.formBuilder.group({
                    key: [inputVar.key, Validators.required],
                    value: [inputVar.value, Validators.required],
                    typeRef: [inputVar.valueType, Validators.required]
                }));
            }
        });
    }

    onSubmit() {
        const data: UnitTestPayload = {
            decisionName: this.dmnData.id.toString(),
            dmnId: this.dmnId,
            title: this.title?.value,
            version: this.dmnVersion,
            //@ts-ignore
            inputData: this.inputPairs.value.map(p => ({ key: p.key, value: p.value, typeRef: p.typeRef })),
            //@ts-ignore
            outputData: this.outputPairs.value.map(p => ({ key: p.key, value: p.value, typeRef: p.typeRef })),
        };

        this.http.executeUnitTest(data).subscribe({
            next: (response: any) => {
                console.log(this.extractFieldData(JSON.parse(response.expected)))
                console.log(this.extractFieldData(JSON.parse(response.actual)))
                this.expectedResult = this.extractFieldData(JSON.parse(response.expected));
                this.actualResult = this.extractFieldData(JSON.parse(response.actual));
                this.resultStatus = response.result;
                this.hasResult = true;
            }, error: (error: any) => {
                console.error(error);
            }
        })
    }

    extractFieldData(input: [{type: string, value: string, valueInfo: {}}]) {
        return input.map(obj => {
            return Object.entries(obj).map(([key, val]) => ({
                key,
                //@ts-ignore
                value: val.value
            }));
        });
    }

    hitPolicyMetadata(policy: string): any {
        const CAMUNDA_HIT_POLICY_SPEC = {
            UNIQUE: {
                label: "Unique",
                multiple: false,
                aggregates: false,
                description: "Exactly one rule must match. Returns the single matching rule.",
                nl_description: "Precies een regel moet overeenkomen. Geeft de enkele overeenkomende regel terug."
            },

            FIRST: {
                label: "First",
                multiple: false,
                aggregates: false,
                description: "Multiple rules may match, but only the first one in rule order is used.",
                nl_description: "Meerdere regels mogen overeenkomen, maar alleen de eerste in regelvolgorde is teruggegeven."
            },

            PRIORITY: {
                label: "Priority",
                multiple: false,
                aggregates: false,
                description: "Multiple rules may match, but the one with the highest priority output is selected.",
                nl_description: "Meerdere regels mogen overeenkomen, maar degene met de hoogste prioriteit output wordt geselecteerd."
            },

            ANY: {
                label: "Any",
                multiple: false,
                aggregates: false,
                description: "Multiple rules may match, but they must all return identical output values.",
                nl_description: "Meerdere regels mogen overeenkomen, maar ze moeten allemaal identieke outputwaarden teruggeven."
            },

            COLLECT: {
                label: "Collect",
                multiple: true,
                aggregates: "optional",
                description: "Returns all matching rules. If an aggregator is provided, values are aggregated.",
                nl_description: "Alle overeenkomende regels worden teruggegeven zonder aggregatie.",
            },
            COLLECT_SUM: {
                label: "Collect Sum",
                multiple: true,
                description: "Sums the output values. If only one output column exists: single result. Otherwise: a list.",
                nl_description: "Somt de outputwaarden op. Als er maar één outputkolom bestaat: enkel resultaat. Anders: een lijst.",
            },
            COLLECT_MIN: {
                label: "Collect Minimum",
                multiple: true,
                description: "Returns the minimum value. If only one output column exists: single result. Otherwise: a list.",
                nl_description: "Geeft de minimumwaarde terug. Als er maar één outputkolom bestaat: enkel resultaat. Anders: een lijst.",
            },
            COLLECT_MAX: {
                label: "Collect Maximum",
                multiple: true,
                description: "Returns the maximum value. If only one output column exists: single result. Otherwise: a list.",
                nl_description: "Geeft de maximumwaarde terug. Als er maar één outputkolom bestaat: enkel resultaat. Anders: een lijst.",
            },
            COLLECT_COUNT: {
                label: "Collect Count",
                multiple: false,
                description: "Returns the number of matching rules. Always a single numeric result.",
                nl_description: "Geeft het aantal overeenkomende regels terug. Altijd een enkel numeriek resultaat.",
            },
            RULE_ORDER: {
                label: "Rule Order",
                multiple: true,
                aggregates: false,
                description: "Returns all matching rules in the order they appear in the table.",
                nl_description: "Geeft alle matchende regels terug, in de volgorde waarin ze in de tabel verschijnen.",
            },

            OUTPUT_ORDER: {
                label: "Output Order",
                returns: "multiple",
                multiple: true,
                description: "Returns all matching rules sorted by output values.",
                nl_description: "Geeft alle overeenkomende regels terug, gesorteerd op outputwaarden.",
            }
        }
        return CAMUNDA_HIT_POLICY_SPEC[policy as keyof typeof CAMUNDA_HIT_POLICY_SPEC];
    }

}
