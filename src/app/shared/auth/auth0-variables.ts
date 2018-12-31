interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'YCa2J7lsnKZSEqkLsU02lgwjYDmQKRTN',
  domain: 'hacker-night.auth0.com',
  callbackURL: 'http://localhost:3000/callback',
  apiUrl: 'localhost:3000'
};
