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

export interface DomainCreateRequest {
    name: string;
    ownerId: string;
    active: boolean;
}
