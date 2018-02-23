import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Link, Vote } from '../../types';
import gql from 'graphql-tag';
import { CREATE_VOTE_MUTATION, ALL_LINKS_QUERY } from './../../graphql';
import { GC_USER_ID } from './../../constants';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { DataProxy } from 'apollo-cache';
import { variable } from '@angular/compiler/src/output/output_ast';
// This is the only working syntax to import lodash
// https://stackoverflow.com/questions/34660265/importing-lodash-into-angular2-typescript-application
import * as _ from 'lodash';
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

  get orderedLinks(): Observable<Link[]> {
    return this.route.url
      .map((segments) => segments.toString())
      .map(path => {
        if (path.includes('top')) {
          return _.orderBy(this.linksToRender, 'votes.length').reverse();
        } else {
          return this.linksToRender;
        }
      });
  }

  @Input()
  pageNumber: number = 1;

  @Input()
  linksPerPage: number = 25;

  get isNewPage(): Observable<boolean> {
      return this.route.url
      .map((segments) => segments.toString())
      .map(path => path.includes('new') ? true : false);
  }

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
    const votedLink = (data as any).allLinks.find(link => link.id === updateLink.id);
    votedLink.votes = createdVote.link.votes;
    store.writeQuery({ query: this.graphqlQuery, data });
  }

  voteForLink(link: Link) {
    const userId = localStorage.getItem(GC_USER_ID);
    const voterIds = link.votes.map(vote => vote.user.id);
    if (voterIds.includes(userId)) {
      alert(`User (${userId}) already voted for this link.`);
      return;
    }
    const mutationSubscription = this.apollo.mutate({
      mutation: CREATE_VOTE_MUTATION,
      variables: {
        userId: userId,
        linkId: link.id
      },
      update: (store, { data: { createVote } }) => {
        this.updateStoreAfterVote(store, createVote, link);
      }
    })
    .subscribe();
    this.subscriptions = [...this.subscriptions, mutationSubscription];
  }

  nextPage() {
    console.log('nextPage');
    const page$ = this.route.paramMap.map((params) => params.get('page'));
    page$.subscribe( page => this.pageNumber = parseInt(page, 10));
    if (this.pageNumber < this.count / this.linksPerPage) {
      const nextPage = this.pageNumber + 1;
      this.$router.navigate([`/new/${nextPage}`]);
    }
  }

  previousPage() {
    console.log('previousPage');
    const page$ = this.route.paramMap.map((params) => params.get('page'));
    page$.subscribe(page => this.pageNumber = parseInt(page, 10));
    if (this.pageNumber > 1) {
      const previousPage = this.pageNumber - 1;
      this.$router.navigate([`/new/${previousPage}`]);
    }
  }
}
