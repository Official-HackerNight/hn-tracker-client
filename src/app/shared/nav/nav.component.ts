import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
/**
 * injects the authService to pull profile, scopes and authentication
 *  e.g. navbar displays the auth.profile.picture & . nickname
 */
export class NavComponent implements OnInit {

  constructor(public auth: AuthService, private breakpointObserver: BreakpointObserver) {
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  ngOnInit(): void {
  }
}
