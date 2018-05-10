import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { Link } from './../../types';
// 2
import { ALL_LINKS_QUERY, AllLinksQueryResponse } from './../../graphql';

@Component({
  selector: 'hn-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css']
})
export class PageSearchComponent implements OnInit, OnDestroy {
  allLinks: Link[] = [];
  loading: boolean = false;
  searchText: string = '';
  logged: boolean = false;
  query: any = ALL_LINKS_QUERY;
  options: any = {};

  subscriptions: Subscription[] = [];

  constructor(
    private apollo: Apollo,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
      });
  }

  executeSearch() {
    this.allLinks = [];
    if(!this.searchText) {
      return;
    }
    this.loading = true;
    this.options = {
      searchText: this.searchText
    };
    const querySubscription = this.apollo.watchQuery<AllLinksQueryResponse>({
      query: this.query,
      variables: this.options
    }).valueChanges.subscribe((response) => {
      this.allLinks = response.data.allLinks;
      this.loading = response.data.loading;
    });

    this.subscriptions = [...this.subscriptions, querySubscription];
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
