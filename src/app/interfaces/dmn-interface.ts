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

export interface DMNVersionInterface {
    id: number;
    version: number;
    status: number;
    modifiedBy: string | null;
    modifiedDate: string | null;
    createdBy: string;
    createdDate: string;
    dmn: DMNInterfaceNoVersion;
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

export interface DMNUpdateFileInterface {
    fileBlob: string;
    modifiedBy: string;
}
