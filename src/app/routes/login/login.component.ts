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

  user: User = {
    hnUserUsername: '',
    hnUserPassword: ''
  };

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('logging in');
  }
}
