import { Component, OnInit } from '@angular/core';
import { User } from './user.interface';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('logging in');
  }

/*
  Explicitly linked methods below to allow VSCode Find All References
  -Steven Kelsey 1/12/2019
*/
  logout() {
    this.auth.logout();
  }
  login() {
    this.auth.login();
  }
}
