import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Link } from '../../types';
import { AuthService } from './../../auth.service';
import {
  ALL_LINKS_QUERY,
  AllLinkQueryResponse,
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from './../../graphql';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'hn-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  allLinks: Link[] = [];
  loading: boolean = true;
  logged: boolean = false;
  subscriptions: Subscription[] = [];
  query: any = ALL_LINKS_QUERY;
  options: any = {};

  constructor(
    private apollo: Apollo,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
      });

    this.options = {
      count: 50,
      offset: 0,
    };

    const allLinkQuery: QueryRef<AllLinkQueryResponse> = this.apollo.watchQuery<AllLinkQueryResponse>({
      query: this.query,
      variables: this.options
    });

    allLinkQuery.subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (previous, { subscriptionData }) => {
        // TODO: Finde out if Bug and file if so:
        /*
        * const newAllLinks = [
        *  ...(previous as any).allLinks // missing ',' doesn't throw compile time error
        * but fails at run-time
        *  (subscriptionData as any).data.Link.node
        * ];
        */
        const newAllLinks = [
          ...(previous as any).allLinks,
          (subscriptionData as any).data.Link.node
        ];
        return {
          ...previous,
          allLinks: newAllLinks
        };
      }
    });

    allLinkQuery.subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
      updateQuery: (previous, { subscriptionData }) => {
        const votedLinkIndex = (previous as any).allLinks.findIndex(link =>
          link.id === (subscriptionData as any).data.Vote.node.link.id
        );
        let newAllLinks;
        if (votedLinkIndex) {
          const node = (subscriptionData as any).data.Vote.node.link;
          newAllLinks = (previous as any).allLinks.slice();
          newAllLinks[votedLinkIndex] = node;
        }
        return {
          ...previous,
          allLinks: newAllLinks
        };
      }
    });

    const querySubscription = allLinkQuery.valueChanges.subscribe((response) => {
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
