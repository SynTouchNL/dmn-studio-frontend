export const environment = {
    production: false,
    keycloak: {
        url: 'localhost:8081',
        realm: 'dmn_tool',
        clientId: 'angular-frontend',
        redirect: 'localhost:4200/'
    },
    quarkusUrl: 'http://localhost:8080',
};
