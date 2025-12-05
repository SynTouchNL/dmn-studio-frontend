// Define the type of the environment variables.
declare interface Env {
    readonly NODE_ENV: string;
    readonly DMNSTUDIO_URL: string;
    readonly DMNSTUDIO_KEYCLOAK_URL: string;
    readonly DMNSTUDIO_KEYCLOAK_REALM: string;
    readonly DMNSTUDIO_KEYCLOAK_CLIENT_ID: string;
    readonly DMNSTUDIO_QUARKUS_URL: string;
    readonly DMNSTUDIO_APP_ENV: string;
    [key: string]: any;
}

// Choose how to access the environment variables.
// Remove the unused options.

// 1. Use import.meta.env.YOUR_ENV_VAR in your code. (conventional)
declare interface ImportMeta {
  readonly env: Env;
}
