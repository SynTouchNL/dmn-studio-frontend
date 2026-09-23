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

export interface DomainPageResponse {
    items: DMNDomainInterface[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface DomainRequest {
    name: string;
    ownerId: string;
    active: boolean;
}
