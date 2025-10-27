export interface DMNInterface {
    id: number;
    name: string;
    owner: string;
    domain: DMNDomainInterface;
    versions: DMNVersionInterface;
}

export interface DMNInterfaceNoVersion {
    id: number;
    name: string;
    owner: string;
    domain: DMNDomainInterface;
}

export type DMNListInterface = DMNInterface[];

export interface DMNDetailInterface extends DMNInterface {
    modified_date: string;
    modified_by: string;
}

export interface DMNVersionInterface {
    id: number;
    version: number;
    status: number;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    dmn: DMNInterfaceNoVersion;
}

export interface DMNVersionShortInterface {
    version: number;
    status: number;
}

export interface DMNFileInterface {
    id: number;
    version: number;
    fileBlob: string;
    status: number;
}

export interface DMNCreateInterface {
    name: string;
    owner: string;
    domainId: number;
    fileBlob: string;
}

export interface DMNCreateVersionInterface {
    dmnId: number;
    fileBlob: string;
    createdBy: string;
}

export interface DMNDomainInterface {
    id: number;
    name: string;
}
export type DomainListInterface = DMNDomainInterface[];

export interface DMNUpdateFileInterface {
    fileBlob: string;
    modifiedBy: string;
}
