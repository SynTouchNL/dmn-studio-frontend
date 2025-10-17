export interface VersionInterface {
    id: number;
    version: number;
    status: number;

    modifiedBy: string | null;
    modifiedDate: string | null;

    createdBy: string;
    createdDate: string;
}

