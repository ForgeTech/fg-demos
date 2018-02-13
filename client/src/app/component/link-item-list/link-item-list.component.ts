import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Link } from '../../types';
import { AuthService } from './../../auth.service';
import { ALL_LINKS_QUERY, AllLinkQueryResponse } from '../../graphql';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'hn-link-item-list',
  templateUrl: './link-item-list.component.html',
  styleUrls: ['./link-item-list.component.css']
})
export class LinkItemListComponent implements OnInit, OnDestroy {
  allLinks: Link[] = [];
  loading: boolean = true;
  logged: boolean = false;
  // TODO: POST ISSUE
  // Type/Interface Subscribtion not implemented at this point.
  // // https://github.com/howtographql/howtographql/blob/master/content/frontend/angular-apollo/6-more-mutations-and-updating-the-store.md
  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo, private authService: AuthService) {
  }

  updateStoreAfterVote(store, createVote, linkId) {
    // 1
    const data = store.readQuery({
      query: ALL_LINKS_QUERY
    });

    // 2
    const votedLink = data.allLinks.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    // 3
    store.writeQuery({ query: ALL_LINKS_QUERY, data });
  }

  ngOnInit() {

    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
      });

    const querySubscription = this.apollo.watchQuery<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY
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
