import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/distinctUntilChanged';
import {
  PAGINATION_PARAM_KEY,
  ROUTE_LINK_DEFAULT,
  ROUTE_LINK_ID_PARAM_KEY,
  ROUTE_LINKS_DEFAULT,
  ROUTE_LINKS_NEW,
  ROUTE_LINKS_TOP,
  ROUTE_COMMENTS_DEFAULT,
  ROUTE_COMMENT_DEFAULT,
  ROUTE_SUBMIT_DEFAULT,
  ROUTE_SEARCH_DEFAULT,
  ROUTE_LOGIN_DEFAULT,
  ROUTE_COMMENT_ID_PARAM_KEY,
  ROUTE_HTTP_404_DEFAULT,
  ROUTE_SEARCH_TERM_PARAM_KEY,
  ROUTE_USER_DEFAULT,
} from './../../constants';

@Component({
  selector: 'hn-header',
  template: `
    <header class="flex pa1 justify-between nowrap orange">
      <div class="flex flex-fixed black">
        <a [routerLink]="['${ROUTE_LINKS_DEFAULT}']" class="fw7 mr1 no-underline black">Hacker News</a>
        <a [routerLink]="['${ROUTE_LINKS_NEW}']" class='ml1 no-underline black'>new</a>
        <div class="ml1">|</div>
        <a [routerLink]="['${ROUTE_LINKS_TOP}']" class='ml1 no-underline black'>voted</a>
        <div class="ml1">|</div>
        <a [routerLink]="['${ROUTE_COMMENTS_DEFAULT}']" class='ml1 no-underline black'>comments</a>
        <div class="ml1">|</div>
        <a [routerLink]="['${ROUTE_SEARCH_DEFAULT}']" class='ml1 no-underline black'>search</a>
        <div class="flex" *ngIf="logged">
          <div class="ml1">|</div>
            <a [routerLink]="['${ROUTE_SUBMIT_DEFAULT}']" class='ml1 no-underline black'>submit</a>
          </div>
        </div>
      <div class="flex flex-fixed">
        <div *ngIf="logged" [routerLink]="[${ROUTE_USER_DEFAULT}]" class="ml1 pointer black">{{userName}}</div>
        <div *ngIf="logged" class="ml1 pointer black" (click)="logout()">(logout)</div>
        <a *ngIf="!logged" [routerLink]="[${ROUTE_LOGIN_DEFAULT}]" class='ml1 no-underline black'>login</a>
      </div>
    </header>
  `,
  // templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logged: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isAuthenticated
      .distinctUntilChanged() // Only emit when the current value is different than the last
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
        this.userName = this.authService.userName;
      });

  }

  logout() {
    this.authService.logout();
  }
}
