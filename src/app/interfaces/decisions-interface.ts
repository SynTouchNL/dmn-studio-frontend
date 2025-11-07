export interface Variable {
    name?: string;
    typeRef?: string;
    values?: [];
}

export interface DecisionVariables {
    id: number;
    name: string;
    incoming: Variable[];
    outgoing: Variable[];
}
