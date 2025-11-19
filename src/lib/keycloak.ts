import Keycloak from "keycloak-js";

// Configuration matches your Keycloak Server setup
const keycloakConfig = {
  url: "http://localhost:8080", // Your Keycloak URL
  realm: "cselol-realm",        // Your created Realm
  clientId: "cselol-public",    // Your Client ID (Must be 'Public' access type)
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;