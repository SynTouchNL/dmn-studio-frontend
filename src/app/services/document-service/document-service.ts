import { Injectable } from '@angular/core';
import DmnModdle from 'dmn-moddle';
import camundaModdle from 'camunda-dmn-moddle/resources/camunda.json';
import { DecisionVariables, Variable } from '../../interfaces/decisions-interface';

@Injectable({
  providedIn: 'root'
})

export class DocumentService {
    generateNewDiagram(name: string): string {
        const sanitized_name = this.sanitizeString(name);
        return `<?xml version="1.0" encoding="UTF-8"?>
                <definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:modeler="http://camunda.org/schema/modeler/1.0" xmlns:camunda="http://camunda.org/schema/1.0/dmn"
                id="${sanitized_name}" name="${name}" namespace="http://camunda.org/schema/1.0/dmn" exporter="Camunda Modeler" exporterVersion="5.38.1" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.23.0">
                    <decision id="${sanitized_name}_decision" name="Nieuwe beslissing" camunda:historyTimeToLive="30">
                        <decisionTable id="${sanitized_name}_decisionTable">
                            <input id="Input_1">
                                <inputExpression id="InputExpression_1" typeRef="string">
                                    <text></text>
                                </inputExpression>
                            </input>
                            <output id="Output_1" typeRef="string" />
                        </decisionTable>
                    </decision>
                    <dmndi:DMNDI>
                        <dmndi:DMNDiagram>
                            <dmndi:DMNShape dmnElementRef="${sanitized_name}_decision">
                                <dc:Bounds height="80" width="180" x="160" y="80" />
                            </dmndi:DMNShape>
                        </dmndi:DMNDiagram>
                    </dmndi:DMNDI>
                </definitions>`;
    }

    async parseDMNVariables(xml: string): Promise<DecisionVariables[]> {
        const model = new DmnModdle({camunda: camundaModdle});

        try {
            const { rootElement: definitions } = await model.fromXML(xml);
            console.log(definitions);
            const decisions = (definitions.drgElement || []).filter((d: any) => d.$type === 'dmn:InformationRequirement' ? false : d.$type === 'dmn:Decision');
            let hitPolicy = "";

            return decisions.map((decision: any) => {
                const incoming: Variable[] = [];
                (decision.informationRequirement || []).forEach((req: any) => {
                    const refName = req.requiredDecision?.name || req.requiredInput?.name;
                    if (refName) incoming.push({name: refName});
                });

                if (decision.decisionLogic?.input) {
                    decision.decisionLogic.input.forEach((input: any) => {
                        const name = input.inputExpression?.text || input.inputVariable || input.label || input.id;
                        const typeRef = input.inputExpression?.typeRef;
                        let options: string[] = input.inputValues?.text?.split?.(',') || [];
                        options = options.map(s => s.replace(/^"|"$/g, "").trim()); // For some reason the notation of dmn-js contains quotes around the values, sanitization.
                        incoming.push({name: name, typeRef: typeRef, values: options});
                    });
                }

                const outgoing: Variable[] = [];
                if (decision.decisionLogic?.output) {
                    decision.decisionLogic.output.forEach((out: any) => {
                        let options: string[] = out.outputValues?.text?.split?.(',') || [];
                        options = options.map(s => s.replace(/^"|"$/g, "").trim()); // For some reason the notation of dmn-js contains quotes around the values, sanitization.
                        outgoing.push({name: out.name, typeRef: out.typeRef, values: options})
                    });

                } else if (decision.literalExpression?.variable) {
                    outgoing.push({
                        name: decision.literalExpression.variable.name,
                        typeRef: decision.literalExpression.variable.typeRef
                    });
                }

                if (decision.decisionLogic?.hitPolicy == "COLLECT") {
                    if (decision.decisionLogic?.aggregation) hitPolicy = decision.decisionLogic.hitPolicy + "_" + (decision.decisionLogic?.aggregation || "");
                } else if (decision.decisionLogic?.hitPolicy === "OUTPUT ORDER" || decision.decisionLogic?.hitPolicy === "RULE ORDER") {
                    hitPolicy = decision.decisionLogic.hitPolicy.replace(" ", "_");
                } else {
                    hitPolicy = decision.decisionTable?.hitPolicy || decision.decisionLogic?.hitPolicy || 'UNIQUE';
                }

                return {
                    id: decision.id,
                    name: decision.name,
                    hitPolicy: hitPolicy,
                    historyTimeToLive: decision.historyTimeToLive,
                    incoming,
                    outgoing
                };
            });

        } catch (e) {
            console.error('DMN moddle parse error:', e);
            return [];
        }
    }

    private sanitizeString(input: any) {
        return input
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
    }

}
