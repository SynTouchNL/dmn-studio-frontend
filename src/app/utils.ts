import DmnModdle from 'dmn-moddle';
import camundaModdle from 'camunda-dmn-moddle/resources/camunda.json';
import {Variable} from './interfaces/decisions-interface';


export function base64ToXml(base64: string): string {
    // Decode Base64 to binary string
    const binaryString = atob(base64);

    // Convert binary string to bytes
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode bytes into UTF-8 text
    return new TextDecoder('utf-8').decode(bytes);
}

// export async function parseDMNVariables(xml: string){
//     const model = new DmnModdle({ camunda: camundaModdle });
//     try {
//         const {
//             rootElement: definitions
//         } = await model.fromXML(xml);
//         console.log(definitions);
//         const decisions = (definitions.drgElement || []).filter((d: any) => d.$type === 'dmn:DecisionsInterface');
//         return decisions.map((decision: any) => {
//             const incoming: Variable[] = [];
//             (decision.informationRequirement || []).forEach((req: any) => {
//                 console.log(req)
//                 const refName = req.requiredDecision?.name || req.requiredInput?.name;
//                 if (refName) incoming.push({ name: refName });
//             });
//
//             if (decision.decisionLogic?.input) {
//                 decision.decisionLogic.input.forEach((input: any) => {
//                     console.log(input)
//                     const name = input.inputVariable || input.label || input.id;
//                     const typeRef = input.inputExpression?.typeRef;
//                     incoming.push({ name, typeRef });
//                 });
//             }
//
//             const outgoing: Variable[] = [];
//             if (decision.decisionLogic?.output) {
//                 decision.decisionLogic.output.forEach((out: any) => {
//                     outgoing.push({ name: out.name, typeRef: out.typeRef })
//                     console.log(out);
//                 });
//             } else if (decision.literalExpression?.variable) {
//                 outgoing.push({ name: decision.literalExpression.variable.name, typeRef: decision.literalExpression.variable.typeRef });
//             }
//             return {
//                 name: decision.name,
//                 historyTimeToLive: decision.historyTimeToLive,
//                 incoming,
//                 outgoing
//             };
//         });
//     } catch (e) {
//         console.error('DMN moddle parse error:', e);
//     }
// }
