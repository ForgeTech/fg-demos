import { Component, Input } from '@angular/core';
import { Link, Vote } from '../../types';
import gql from 'graphql-tag';
import { CREATE_VOTE_MUTATION, ALL_LINKS_QUERY } from './../../graphql';
import { GC_USER_ID } from './../../constants';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { DataProxy } from 'apollo-cache';
import { variable } from '@angular/compiler/src/output/output_ast';

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
  isAuthenticated: Link[];

  @Input()
  graphqlQuery: any = {};

  @Input()
  graphqlQueryOptions: any = {};

  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo) {}

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
}
