import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Link } from '../../types';
import { AuthService } from './../../auth.service';
import {
  ALL_LINKS_QUERY,
  AllLinkQueryResponse,
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from '../../graphql';
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

    const allLinkQuery: QueryRef<AllLinkQueryResponse> = this.apollo.watchQuery<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY
    });

    allLinkQuery
      .subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (previous, { subscriptionData }) => {
          console.log('previous');
          console.log(previous);
          const newAllLinks = [
            ...(previous as any).allLinks
            (subscriptionData as any).data.Link.node,
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
        const votedLinkIndex = (previous as any).allLinks.findIndex( link =>
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
