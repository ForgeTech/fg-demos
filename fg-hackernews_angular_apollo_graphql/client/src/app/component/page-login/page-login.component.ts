import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {
  AUTH_USER_ID,
  AUTH_USER_NAME,
  AUTH_USER_TOKEN
} from './../../constants';
import {
  CREATE_USER_MUTATION,
  CreateUserMutationResponse,
  SIGNIN_USER_MUTATION,
  SigninUserMutationResponse
} from './../../graphql';

@Component({
  selector: 'hn-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {
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
        const name = result.data.authenticateUser.name;
        this.authService.saveUserData(id, token, name);
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
        const name = result.data.authenticateUser.name;
        this.authService.saveUserData(id, token, name);
        this.router.navigate(['/']);

      }, (error) => {
        alert(error);
      });
    }
  }
}
