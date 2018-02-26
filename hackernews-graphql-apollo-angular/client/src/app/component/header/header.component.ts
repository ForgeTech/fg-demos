import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'hn-header',
  templateUrl: './header.component.html',
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
