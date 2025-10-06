export interface DMNInterface {
    id: number;
    name: string;
    owner: string;
    domain: string;
    latest_version: number;
    status: number;
    version: number;
}

export type DMNListInterface = DMNInterface[];

export interface DMNDetailInterface extends DMNInterface {
    modified_date: string;
    modified_by: string;
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
    domain: {
        id: number;
    };
}

export interface DMNCreateVersionInterface {
    dmn_id: number;
    file: string;
    created_by: string;
}

export interface DMNDomainInterface {
    id: number;
    name: string;
}
export type DomainListInterface = DMNDomainInterface[];
