import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from 'apollo-client';
import { Apollo, QueryRef } from 'apollo-angular';
// import 'rxjs/rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../../auth.service';
import { Link } from '../../types';
import {
  ALL_LINKS_QUERY,
  AllLinksQueryResponse,
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from './../../graphql';
import { PAGINATION_LINKS_PER_PAGE } from './../../constants';

@Component({
  selector: 'hn-main',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit, OnDestroy {

  allLinks: Link[] = [];
  loading: boolean = true;
  logged: boolean = false;
  subscriptions: Subscription[] = [];
  query: any = ALL_LINKS_QUERY;
  options: any = {};
  linksPerPage: number = PAGINATION_LINKS_PER_PAGE;
  count: number;
  first$: Observable<number>;
  skip$: Observable<number>;
  orderBy$: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
      });

    const pageParams$: Observable<number> = this.route.paramMap
      .map((params) => {
        // console.log('pageParams');
        // console.log(params.get('page'));
        return parseInt(params.get('page'), 10);
      });

    const path$: Observable<string> = this.route.url
      .map((segments) => {
        // console.log('path');
        // console.log(segments.toString());
        return segments.toString();
      });

    this.first$ = path$
      .map((path) => {
        // console.log('first');
        const isNewPage = path.includes('new');
        // console.log(isNewPage ? this.linksPerPage : 100);
        return this.linksPerPage;
      });

    this.skip$ = Observable.combineLatest(path$, pageParams$)
      .map(([path, page]) => {
        // console.log('skip');
        const isNewPage = path.includes('new');
        // console.log(isNewPage ? (page - 1) * this.linksPerPage : 0);
        return isNewPage ? (page - 1) * this.linksPerPage : 0;
      });

    this.orderBy$ = path$
      .map((path) => {
        // console.log('orderBy');
        const isNewPage = path.includes('new');
        // console.log(isNewPage ? 'createdAt_DESC' : null);
        return isNewPage ? 'createdAt_DESC' : null;
      });

    const getQuery = (variables): Observable<ApolloQueryResult<AllLinksQueryResponse>> => {
      const query = this.apollo.watchQuery({
        query: ALL_LINKS_QUERY,
        variables
      });

      query.subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        variables: variables,
        updateQuery: (previous, { subscriptionData }) => {
          // console.log('EXECUTES!');
          // console.log(subscriptionData);
          const newAllLinks = [
            (subscriptionData as any).data.Link.node,
            ...(previous as any).allLinks
          ];
          return {
            ...previous,
            allLinks: newAllLinks
          };
        }
      });
      // TODO: Omitted as stated in tutorial, test if this still works
      // when finished with current tutorial part 9-pagination
      query.subscribeToMore({
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

      return query.valueChanges as Observable<ApolloQueryResult<AllLinksQueryResponse>>;
    };

    const allLinkQuery: Observable<ApolloQueryResult<AllLinksQueryResponse>> = Observable
      .combineLatest(this.first$, this.skip$, this.orderBy$, (first, skip, orderBy) => (this.options = { first, skip, orderBy }))
      .switchMap((variables: any) => {
        // console.log('AllLinkQueryRequest:');
        // console.log(variables);
        return getQuery(variables);
      });

    const querySubscription = allLinkQuery.subscribe(response => {
      console.log('AllLinksQueryResponse');
      this.allLinks = response.data.allLinks;
      this.count = response.data._allLinksMeta.count;
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
