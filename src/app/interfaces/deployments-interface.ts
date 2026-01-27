import { DMNInterface, DMNVersionInterface } from './dmn-interface';

export interface DeploymentsInterface {
    deploymentId: number;
    dmnId: number;
    deployedBy: string;
    deployedTime: string;
    environmentId: number;
    environmentName: string;
    deploymentRef: string;
    dmnVersion: {
        id: number;
        version: number;
        status: number;
        modifiedBy: string;
        modifiedDate: string;
        createdBy: string;
        createdDate: string;
    }
    dmn: DMNInterface;
}

export interface GenericDeployment {
    id: number;
    deployedBy: string;
    deployedTime: string;
    deployedTo: {
        id: number;
        name: string;
    }
    version: DMNVersionInterface;
}
