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
  AllLinkQueryResponse,
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from './../../graphql';
import { FG_LINKS_PER_PAGE } from './../../constants';

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
  linksPerPage: number = FG_LINKS_PER_PAGE;
  count: number;
  first$: Observable<number>;
  skip$: Observable<number>;
  orderBy$: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated;
      });

    // this.options = {
    //   count: 50,
    //   offset: 0,
    // };

    const pageParams$: Observable<number> = this.route.paramMap
      .map((params) => {
        return parseInt(params.get('page'), 10);
      });

    const path$: Observable<string> = this.route.url
      .map((segments) => (segments as any).toString());

    this.first$ = path$
      .map((path) => {
        const isNewPage = path.includes('new');
        return isNewPage ? this.linksPerPage : 100;
      });

    this.skip$ = Observable.combineLatest(path$, pageParams$)
      .map(([path, page]) => {
        const isNewPage = path.includes('new');
        return isNewPage ? (page - 1) * this.linksPerPage : 0;
      });

    this.orderBy$ = path$
      .map((path) => {
        const isNewPage = path.includes('new');
        return isNewPage ? 'createdAt_DESC' : null;
      });

    const getQuery = (variables): Observable<ApolloQueryResult<AllLinkQueryResponse>> => {
      const query = this.apollo.watchQuery({
        query: ALL_LINKS_QUERY,
        variables
      });

      query.subscribeToMore({
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

      // TODO: Omitted as stated in tutorial, test if this still works
      // when finished with current tutorial part 9-pagination
      // query.subscribeToMore({
      //   document: NEW_VOTES_SUBSCRIPTION,
      //   updateQuery: (previous, { subscriptionData }) => {
      //     const votedLinkIndex = (previous as any).allLinks.findIndex(link =>
      //       link.id === (subscriptionData as any).data.Vote.node.link.id
      //     );
      //     let newAllLinks;
      //     if (votedLinkIndex) {
      //       const node = (subscriptionData as any).data.Vote.node.link;
      //       newAllLinks = (previous as any).allLinks.slice();
      //       newAllLinks[votedLinkIndex] = node;
      //     }
      //     return {
      //       ...previous,
      //       allLinks: newAllLinks
      //     };
      //   }
      // });

      return query.valueChanges as Observable<ApolloQueryResult<AllLinkQueryResponse>>;
    };

    const allLinkQuery: Observable<ApolloQueryResult<AllLinkQueryResponse>> = Observable
      .combineLatest( this.first$, this.skip$, this.orderBy$, (first, skip, orderBy) => ({ first, skip, orderBy}))
      .switchMap((variables: any) => getQuery(variables));

    const querySubscription = allLinkQuery.subscribe(response => {
        this.allLinks = response.data.allLinks;
        this.count = response.data._allLinksMeta.count;
        this.loading = response.data.loading;
      });

    // const allLinkQuery: QueryRef<AllLinkQueryResponse> = this.apollo.watchQuery<AllLinkQueryResponse>({
    //   query: this.query,
    //   variables: this.options
    // });

    // allLinkQuery.subscribeToMore({
    //   document: NEW_LINKS_SUBSCRIPTION,
    //   updateQuery: (previous, { subscriptionData }) => {
    //     // TODO: Finde out if Bug and file if so:
    //     /*
    //     * const newAllLinks = [
    //     *  ...(previous as any).allLinks // missing ',' doesn't throw compile time error
    //     * but fails at run-time
    //     *  (subscriptionData as any).data.Link.node
    //     * ];
    //     */
    //     const newAllLinks = [
    //       ...(previous as any).allLinks,
    //       (subscriptionData as any).data.Link.node
    //     ];
    //     return {
    //       ...previous,
    //       allLinks: newAllLinks
    //     };
    //   }
    // });

    // allLinkQuery.subscribeToMore({
    //   document: NEW_VOTES_SUBSCRIPTION,
    //   updateQuery: (previous, { subscriptionData }) => {
    //     const votedLinkIndex = (previous as any).allLinks.findIndex(link =>
    //       link.id === (subscriptionData as any).data.Vote.node.link.id
    //     );
    //     let newAllLinks;
    //     if (votedLinkIndex) {
    //       const node = (subscriptionData as any).data.Vote.node.link;
    //       newAllLinks = (previous as any).allLinks.slice();
    //       newAllLinks[votedLinkIndex] = node;
    //     }
    //     return {
    //       ...previous,
    //       allLinks: newAllLinks
    //     };
    //   }
    // });

    // const querySubscription = allLinkQuery.valueChanges.subscribe((response) => {
    //   this.allLinks = response.data.allLinks;
    //   this.loading = response.data.loading;
    // });

    // this.subscriptions = [...this.subscriptions, querySubscription];
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
