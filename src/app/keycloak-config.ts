export const keycloakConfig = {
  config: {
    url: 'http://localhost:8085',
    realm: 'mi-realm',
    clientId: 'mi-api',
  },
  initOptions: {
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    checkLoginIframe: true,
    checkLoginIframeInterval: 25,
    pkceMethod: 'S256'
  }
};