export interface DMNDomainInterface {
    id: number;
    name: string;
    ownerId: string;
    owner: string;
    active: boolean;
    createdBy: string;
    editedBy: string;
    createdAt: string;
    editedAt: string;
}

export interface DomainRequest {
    name: string;
    ownerId: string;
    active: boolean;
}
