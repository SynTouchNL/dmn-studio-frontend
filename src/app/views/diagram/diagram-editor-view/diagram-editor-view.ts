import {Component, AfterViewInit, ElementRef, ViewChild, inject} from '@angular/core';
import DmnModeler from 'dmn-js/lib/Modeler';
import { DmnPropertiesPanelModule, DmnPropertiesProviderModule } from 'dmn-js-properties-panel';
import { from, Observable } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { Title } from '@angular/platform-browser';

// Services
import { DMNService } from '../../../services/dmn-service/dmn-service';
import { AlertService } from '../../../services/alert-service/alert-service';

// Interfaces
import { ViewList } from '../../../interfaces/view-interface';

@Component({
    selector: 'app-diagram-editor-view',
    imports: [],
    templateUrl: './diagram-editor-view.html',
    styleUrl: './diagram-editor-view.css'
})
export class DiagramEditorView {
    @ViewChild('dmnModelerRef', {static: true}) private dmnModelerRef: ElementRef | undefined;
    @ViewChild('editorTabRef', { static: true }) editorTabs!: ElementRef;

    newFile: string = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" xmlns:camunda="http://camunda.org/schema/1.0/dmn" id="invoiceBusinessDecisions" name="Invoice Business Decisions" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="invoiceClassification" name="Invoice Classification" camunda:historyTimeToLive="30">
    <decisionTable id="decisionTable">
      <input id="clause1" label="Invoice Amount" camunda:inputVariable="">
        <inputExpression id="inputExpression1" typeRef="double">
          <text>amount</text>
        </inputExpression>
      </input>
      <input id="InputClause_15qmk0v" label="Invoice Category" camunda:inputVariable="">
        <inputExpression id="LiteralExpression_1oi86cw" typeRef="string">
          <text>invoiceCategory</text>
        </inputExpression>
        <inputValues id="UnaryTests_0kisa67">
          <text>"Travel Expenses","Misc","Software License Costs"</text>
        </inputValues>
      </input>
      <output id="clause3" label="Classification" name="invoiceClassification" typeRef="string">
        <outputValues id="UnaryTests_08dl8wf">
          <text>"day-to-day expense","budget","exceptional"</text>
        </outputValues>
      </output>
      <rule id="DecisionRule_1of5a87">
        <inputEntry id="LiteralExpression_0yrqmtg">
          <text>&lt; 250</text>
        </inputEntry>
        <inputEntry id="UnaryTests_06edsin">
          <text>"Misc"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_046antl">
          <text>"day-to-day expense"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_1ak4z14">
        <inputEntry id="LiteralExpression_0qmsef6">
          <text>[250..1000]</text>
        </inputEntry>
        <inputEntry id="UnaryTests_09b743h">
          <text>"Misc"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_05xxvip">
          <text>"budget"</text>
        </outputEntry>
      </rule>
      <rule id="row-49839158-4">
        <inputEntry id="UnaryTests_0le0gl8">
          <text>&gt; 1000</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0pukamj">
          <text>"Misc"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1e76ugx">
          <text>"exceptional"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_0cuxolz">
        <inputEntry id="LiteralExpression_05lyjk7">
          <text></text>
        </inputEntry>
        <inputEntry id="UnaryTests_0ve4z34">
          <text>"Travel Expenses"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1bq8m03">
          <text>"day-to-day expense"</text>
        </outputEntry>
      </rule>
      <rule id="row-49839158-2">
        <inputEntry id="UnaryTests_1nssdlk">
          <text></text>
        </inputEntry>
        <inputEntry id="UnaryTests_01ppb4l">
          <text>"Software License Costs"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0y00iih">
          <text>"budget"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
  <decision id="invoice-assign-approver" name="Assign Approver Group" camunda:historyTimeToLive="30">
    <informationRequirement id="InformationRequirement_1kkeocv">
      <requiredDecision href="#invoiceClassification" />
    </informationRequirement>
    <decisionTable id="DecisionTable_16o85h8" hitPolicy="COLLECT">
      <input id="InputClause_0og2hn3" label="Invoice Classification" camunda:inputVariable="">
        <inputExpression id="LiteralExpression_1vywt5q" typeRef="string">
          <text>invoiceClassification</text>
        </inputExpression>
        <inputValues id="UnaryTests_0by7qiy">
          <text>"day-to-day expense","budget","exceptional"</text>
        </inputValues>
      </input>
      <output id="OutputClause_1cthd0w" label="Approver Group" name="result" typeRef="string">
        <outputValues id="UnaryTests_1ulmk9p">
          <text>"management","accounting","sales"</text>
        </outputValues>
      </output>
      <rule id="row-49839158-1">
        <inputEntry id="UnaryTests_18ifczd">
          <text>"day-to-day expense"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0sgxulk">
          <text>"accounting"</text>
        </outputEntry>
      </rule>
      <rule id="row-49839158-6">
        <inputEntry id="UnaryTests_0kfae8g">
          <text>"day-to-day expense"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1iksrro">
          <text>"sales"</text>
        </outputEntry>
      </rule>
      <rule id="row-49839158-5">
        <inputEntry id="UnaryTests_08cevwi">
          <text>"budget", "exceptional"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0c7hz8g">
          <text>"management"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="DMNDiagram_1cuuevk">
      <dmndi:DMNShape id="DMNShape_1abvt5s" dmnElementRef="invoiceClassification">
        <dc:Bounds height="55" width="100" x="393" y="325" />
      </dmndi:DMNShape>
      <dmndi:DMNShape id="DMNShape_1ay7af5" dmnElementRef="invoice-assign-approver">
        <dc:Bounds height="55" width="100" x="464" y="194" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_1wn1950" dmnElementRef="InformationRequirement_1kkeocv">
        <di:waypoint x="458" y="325" />
        <di:waypoint x="498" y="249" />
      </dmndi:DMNEdge>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>`

    private dmnJS: DmnModeler;
    private dmnDetails: any;
    dmnId: number = 0;
    dmnVersion: number = 0;
    dmnFile: any = "";
    views: ViewList = [];
    activeViewIdx: number = 0;
    idx: number = 0;

    private activatedRoute = inject(ActivatedRoute);

    constructor(
        private router: Router,
        private dmnService: DMNService,
        private alertService: AlertService,
        private titleService: Title
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.dmnVersion = navigation?.extras.state?.['version'];
        this.dmnId = navigation?.extras.state?.['id'];
        this.dmnFile = navigation?.extras.state?.['file'];

        this.dmnJS = new DmnModeler({
            container: this.dmnModelerRef?.nativeElement,
            width: "100%",
            height: "100%",
            position: "absolute",
            decisionTable: {
                keyboard: {
                    bindTo: document
                }
            },
            drd: {
                propertiesPanel: {
                    parent: '#dmn-properties-panel'
                },
                additionalModules: [
                    DmnPropertiesPanelModule,
                    DmnPropertiesProviderModule
                ]
            }
        });

        this.dmnJS.on('views.changed', (event: any) => {
            this.views = event.views;
            this.activeViewIdx = this.views.indexOf(event.activeView);
        });

        this.activatedRoute.params.subscribe(params => {
            this.dmnVersion = +params['version'];
        });

        this.activatedRoute.params.subscribe((params) => {
            this.dmnId = +params['id'] || 0;
        });
    }

    ngAfterViewInit(): void {
        this.dmnJS.attachTo(this.dmnModelerRef!.nativeElement);
        if(!this.dmnFile || this.dmnFile === ""){
            this.dmnService.getDMNFile(this.dmnId, this.dmnVersion).subscribe(
                data => {
                    this.dmnFile = data.fileBlob;
                    this.importDiagram(this.dmnFile);
                }
            )
        } else {
            this.importDiagram(this.dmnFile);
        }
        this.titleService.setTitle("DMN Tool - Bewerk DMN");
    }

    ngOnDestroy(): void {
        this.dmnJS?.destroy();
    }

    private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
        return from(
            this.dmnJS.importXML(xml)
                .then((result: any) => {
                    //this.dmnDetails = this.dmnJS.getDefinitions();
                    return result;
                })
                .catch((err: any) => {
                    this.alertService.error("Error", "Er was een probleem bij het laden van de diagram: " + err.message);
                    throw err;
                })
        );
    }

    saveDiagram() {
        this.dmnJS.saveXML({format: true}, (err: any, xml: any) => {
            const encoder = new TextEncoder();
            const xmlBytes = encoder.encode(xml);

            const xmlBase64 = btoa(String.fromCharCode(...xmlBytes));

            let request = {
                id: this.dmnId,
                version: this.dmnVersion,
                file: xmlBase64
            }

            this.dmnService.saveDMNFile(this.dmnId, this.dmnVersion, request).subscribe(response => {
                if (response) {
                    this.alertService.success('Diagram opgeslagen', '');
                    this.router.navigate(['/dmns/' + this.dmnId + '/' + this.dmnVersion + '/view']);
                }
            }, error => {
                this.alertService.error("Error", "Er was een probleem bij het opslaan van de diagram: " + error.message);
            });
        });
    }

    async openView(idx: number){
        this.activeViewIdx = idx;
        try {
            this.dmnJS.open(this.views[idx]);
        } catch (err) {
            console.error('error opening tab', err);
        }
    }

    checkClass(type: string){
        switch(type) {
            case "drd":
                return "dmn-icon-lasso-tool";
            case "decisionTable":
                return "dmn-icon-decision-table";
            case "literalExpression":
                return "dmn-icon-literal-expression";
            default:
                return ""
        }
    }
}
