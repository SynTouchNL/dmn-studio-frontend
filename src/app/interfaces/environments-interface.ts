export interface EnvironmentDeployment {
    id: number;
    version: {
        version: number;
        status: number;
        modifiedBy: string | null;
        modifiedDate: string | null;
        createdBy: string;
        createdDate: string;
    };
    deployedBy: string;
    deployedTime: string;
    deploymentRef: string;
    dmnId: number;
    dmnName: string;
}

export interface EnvironmentInterface {
    id: number;
    name: string;
    url: string | null;
    username: string | null;
    passwordSet: boolean;
    active: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    deployments: EnvironmentDeployment[];
}

export interface EnvironmentRequest {
    name: string;
    url: string;
    username: string;
    /** Omit to keep the stored password. */
    password?: string;
    active: boolean;
}

export interface ConnectionTestResult {
    success: boolean;
    httpStatus: number | null;
    message: string;
    durationMs: number;
}
