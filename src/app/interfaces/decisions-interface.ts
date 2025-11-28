export interface Variable {
    name?: string;
    typeRef?: string;
    values?: string[];
}

export interface DecisionVariables {
    id: number;
    name: string;
    hitPolicy: string;
    incoming: Variable[];
    outgoing: Variable[];
}

export interface KeyValuePair {
    key: string;
    typeRef?: string;
    value: string;
}

export interface UnitTestPayload {
    decisionName: string;
    dmnId: number;
    title: string;
    version: number;
    inputData: KeyValuePair[];
    outputData: KeyValuePair[];
}
