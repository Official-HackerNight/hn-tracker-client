import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { NGXLogger } from 'ngx-logger';
import 'rxjs';
import { Subject } from 'rxjs';
import { AUTH_CONFIG } from './auth0-variables';
/**
 * Auth0-js Service
 * Docs: https://auth0.github.io/auth0.js/index.html
 *
 */
@Injectable()
export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  private _scopes: string;

  public userProfile: any;
  refreshSubscription: any;
  requestedScopes = 'openid email profile read:messages write:messages';

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.apiUrl,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: this.requestedScopes
  });

  constructor(public router: Router, private logger: NGXLogger) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
    this._scopes = '';
  }

  get accessToken(): string {
    this.logger.info('auth.accessToken() ' + this._accessToken);
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  /**
   * References: none?
   *
   * login() calls:
   * authorize(options): Redirects to the /authorize endpoint to start an authentication/authorization transaction.
   * Auth0 will call back to your application with the results at the specified redirectUri.
   * The default scope for this method is openid profile email.
   */
  public login(): void {
    this.logger.info('auth.login() ');
    this.auth0.authorize();
  }

  /**
   *  References: app.component constructor
   *   removed from login component
   *    -Steve 1/12/2019
   */
  public handleAuthentication(): void {
    this.logger.log('auth.handleAuthentication() ' );
    this.auth0.parseHash((err, authResult) => {
      this.logger.log('auth.handleAuthentication() authResult: ');
      console.dir(authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.logger.log('auth.handleAuthentication() authResult.accessToken ' + authResult.accessToken );
        this.localLogin(authResult);
        this.router.navigate(['/dashboard']);
      } else if (err) {
        this.logger.log('auth.handleAuthentication authResult/accessToken/idToken == null ');
        this.router.navigate(['/dashboard']);
        console.log(err);
        this.logger.log(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  /**
   * References: nav component
   *
   * @param cb desc
   *
   */
  public getProfile(): void {
    this.logger.info('auth.getProfile(cb) ');
    if (!this._accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        this.logger.info(profile);
        self.userProfile = profile;
      }
    });
  }

  /**
   * References: auth.handleAuthentication() & auth.renewToken
   *
   *  Sets localstorage
   *  Sets members: _scopes, _accessToken, _idToken, _expiresAt
   *  Invokes getProfile() since authenticated
   * @param authResult desc
   */
  private localLogin(authResult): void {
    this.logger.info('auth.localLogin(authResult) ');
    this.logger.info( authResult);
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.requestedScopes || '';
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
    this._scopes = JSON.stringify(scopes);
    this.getProfile();
  }

  /**
   * References: app component init
   *
   * Checks the session with the server
   * Calls: localLogin on success or logout on fail
   */
  public renewTokens(): void {
    this.logger.info('auth.renewTokens ');
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  /**
   * References: login component & auth.renewTokens()
   *
   */
  public logout(): void {
    this.logger.info('auth.logout() ');
    // Remove tokens and expiry time
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
    this._scopes = '';
    this.userProfile = null;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  /**
   * References: auth-guard, scope-guard & html snippets (navbar mainly)
   */
  public isAuthenticated(): boolean {
    this.logger.trace('auth.isAuthenticated() ');
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this._expiresAt;
  }

  /**
   * References: scope-guard
   *
   * Checks _scopes
   * returns null if none
   * @param scopes pulled from Auth0
   */
  public userHasScopes(scopes: Array<string>): boolean {
    this.logger.trace('auth.userHasScopes() ');
    this.logger.trace('this._scopes: ');
    this.logger.trace(this._scopes);
    if (this._scopes) {
      const grantedScopes = JSON.parse(this._scopes).split(' ');
      return scopes.every(scope => grantedScopes.includes(scope));
    } else {
      return null;
    }
  }
}

