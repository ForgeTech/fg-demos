import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { GC_AUTH_TOKEN, GC_USER_ID } from './../../constants';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {
  CREATE_USER_MUTATION,
  CreateUserMutationResponse,
  SIGNIN_USER_MUTATION,
  SigninUserMutationResponse
} from './../../graphql';

@Component({
  selector: 'hn-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: boolean = true; // switch between Login and SignUp
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private router: Router,
    private authService: AuthService,
    private apollo: Apollo) {
  }

  ngOnInit() {
  }

  confirm() {
    if (this.login) {
      this.apollo.mutate<SigninUserMutationResponse>({
        mutation: SIGNIN_USER_MUTATION,
        variables: {
          email: this.email,
          password: this.password
        }
      }).subscribe((result) => {
        console.log('Signin User');
        console.log(result.data);
        const id = result.data.authenticateUser.id;
        const token = result.data.authenticateUser.token;
        this.saveUserData(id, token);
        this.router.navigate(['/']);
      }, (error) => {
        alert(error);
      });
    } else {
      this.apollo.mutate<CreateUserMutationResponse>({
        mutation: CREATE_USER_MUTATION,
        variables: {
          name: this.name,
          email: this.email,
          password: this.password
        }
      }).subscribe((result) => {
        console.log('Create User');
        console.log(result.data);
        const id = result.data.authenticateUser.id;
        const token = result.data.authenticateUser.token;
        this.saveUserData(id, token);

        this.router.navigate(['/']);

      }, (error) => {
        alert(error);
      });
    }
  }

  saveUserData(id, token) {
    localStorage.setItem(GC_USER_ID, id);
    localStorage.setItem(GC_AUTH_TOKEN, token);
    this.authService.setUserId(id);
  }
}
