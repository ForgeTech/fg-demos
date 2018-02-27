import {
  Component,
  Input
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { Link, Vote } from '../../types';
import gql from 'graphql-tag';
import {
  CREATE_VOTE_MUTATION,
  ALL_LINKS_QUERY
} from './../../graphql';
import {
  AUTH_USER_ID,
  PAGINATION_LINKS_PER_PAGE
} from './../../constants';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { DataProxy } from 'apollo-cache';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'hn-link-item-list',
  templateUrl: './link-item-list.component.html',
  styleUrls: ['./link-item-list.component.css']
})
export class LinkItemListComponent {
  @Input()
  loading: boolean = true;

  @Input()
  logged: boolean = false;

  @Input()
  linksToRender: Link[];

  @Input()
  pageNumber: number = 1;

  @Input()
  linksPerPage: number = PAGINATION_LINKS_PER_PAGE;

  get curPageNumber(): Observable<number> {
    return this.route.paramMap
      .map((params) => {
        return parseInt(params.get('page'), 10);
      });
  }

  get firstPage(): Observable<boolean> {
    return this.curPageNumber.map( pageNumber => pageNumber === 1 );
  }

  get morePages(): Observable<boolean> {
    return this.curPageNumber.map( pageNumber => pageNumber < this.count / this.linksPerPage );
  }

  @Input()
  isAuthenticated: Link[];

  @Input()
  graphqlQuery: any = {};

  @Input()
  graphqlQueryOptions: any = {};

  @Input()
  count: number;

  subscriptions: Subscription[] = [];

  constructor(
    private $router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo
  ) {}

  updateStoreAfterVote(store: DataProxy, createdVote: Vote, updateLink: Link) {
    const data = store.readQuery({
      query: this.graphqlQuery,
      variables: this.graphqlQueryOptions
    });
    console.log('UpdateStore:');
    console.log(createdVote);
    console.log(updateLink);
    const votedLink = (data as any).allLinks.find(link => link.id === updateLink.id);
    const voteCount = updateLink.voteCount + 1;
    votedLink.votes = createdVote.link.votes;
    votedLink.voteCount = voteCount;
    store.writeQuery({ query: this.graphqlQuery, data });
  }

  voteForLink(link: Link) {
    const userId = localStorage.getItem(AUTH_USER_ID);
    const voterIds = link.votes.map(vote => vote.user.id);
    const voteCount = link.voteCount + 1;
    if (voterIds.includes(userId)) {
      alert(`User (${userId}) already voted for this link.`);
      return;
    }
    const mutationSubscription = this.apollo.mutate({
      mutation: CREATE_VOTE_MUTATION,
      variables: {
        userId: userId,
        linkId: link.id,
        voteCount: voteCount
      },
      update: (store, { data: { createVote } }) => {
        this.updateStoreAfterVote(store, createVote, link);
      }
    })
    .subscribe();
    this.subscriptions = [...this.subscriptions, mutationSubscription];
  }

  pagedIndex( index: number ): number {
    return index + this.linksPerPage * (this.pageNumber - 1);
  }

  nextPage() {
    const path$ = this.route.pathFromRoot.map((segment) => segment.toString());
    const page$: Observable<number> = this.route.paramMap.map((params) => parseInt(params.get('page'), 10));
    const pathChange$: Observable<[any, number]> = Observable.combineLatest(path$, page$);

    pathChange$.subscribe( ([path, page]) => {
      console.log('NEXTPAGE');
      console.log(path);
      console.log(page);
      // if (page < this.count / this.linksPerPage) {
      //   const nextPage = this.pageNumber + 1;
      //   this.$router.navigate([`/new/${nextPage}`]);
      // }
    });
    // page$.subscribe( page => this.pageNumber = parseInt(page, 10));
  }

  previousPage() {
    console.log('previousPage');
    const page$ = this.route.paramMap.map((params) => params.get('page'));
    // page$.subscribe(page => this.pageNumber = parseInt(page, 10));
    // if (this.pageNumber > 1) {
    //   const previousPage = this.pageNumber - 1;
    //   this.$router.navigate([`/new/${previousPage}`]);
    // }
  }
}
