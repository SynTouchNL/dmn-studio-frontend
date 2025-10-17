import {VersionInterface} from './version-interface';

export interface DeploymentsInterface {
    id: number;
    deployedBy: string;
    deployedTime: string;
    environmentName: string;
    dmnId: number;
    dmnVersion: {
        id: number;
        version: number;
        status: number;
        modifiedBy: string;
        modifiedDate: string;
        createdBy: string;
        createdDate: string;
    }
    dmn: {
        id: number;
        name: string;
        domain: {
            id: number;
            name: string;
        }
        versions: {
            id: number;
            version: number;
            status: number;
            modifiedBy: string;
            modifiedDate: string;
            createdBy: string;
            createdDate: string;
        }
    }
}

export interface GenericDeployment {
    id: number;
    deployedBy: string;
    deployedTime: string;
    deployedTo: {
        id: number;
        name: string;
    }
    version: VersionInterface;
}
