import { GenericDeployment } from './deployments-interface';

export interface EnvironmentsInterface {
    id: number;
    name: string;
    deployments: GenericDeployment
}
