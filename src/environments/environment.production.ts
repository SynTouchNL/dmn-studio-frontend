export const environment = {
    production: true,
    keycloak: {
        url: import.meta.env.DMNSTUDIO_KEYCLOAK_URL,
        realm: import.meta.env.DMNSTUDIO_KEYCLOAK_REALM,
        clientId: import.meta.env.DMNSTUDIO_KEYCLOAK_CLIENT_ID,
        redirect: import.meta.env.DMNSTUDIO_URL
    },
    quarkusUrl: import.meta.env.DMNSTUDIO_QUARKUS_URL
};
