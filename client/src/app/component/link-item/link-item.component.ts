import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Link } from '../../types';
import { timeDifferenceForDate } from './../../app.utils';
import { CREATE_VOTE_MUTATION } from './../../graphql';
import { GC_USER_ID } from './../../constants';
import { Apollo } from 'apollo-angular';
import { DataProxy } from 'apollo-cache';

@Component({
  selector: 'hn-link-item',
  templateUrl: './link-item.component.html',
  styleUrls: ['./link-item.component.css']
})
export class LinkItemComponent implements OnInit, OnDestroy {
  @Input()
  link: Link;

  @Input()
  index: number = 0;

  @Input()
  isAuthenticated: boolean = false;

  // TODO: POST ISSUE/ENHANCEMENT:
  // This is bad - as it makes the component depending on its
  // parent component - instead a event should be thrown and
  // parent should bind 'callback'-metode to the event.
  // // https://github.com/howtographql/howtographql/blob/master/content/frontend/angular-apollo/6-more-mutations-and-updating-the-store.md
  @Input()
  updateStoreAfterVote: any; // UpdateStoreAfterVoteCallback;

  // TODO: POST ISSUE
  // Type/Interface Subscribtion not implemented at this point.
  // // https://github.com/howtographql/howtographql/blob/master/content/frontend/angular-apollo/6-more-mutations-and-updating-the-store.md
  subscriptions: any[] /* Subscribtion */ = [];

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
  }

  voteForLink() {
    const userId = localStorage.getItem(GC_USER_ID);
    const voterIds = this.link.votes.map(vote => vote.user.id);
    if (voterIds.includes(userId)) {
      alert(`User (${userId}) already voted for this link.`);
      return;
    }
    const linkId = this.link.id;

    const mutationSubscription = this.apollo.mutate({
      mutation: CREATE_VOTE_MUTATION,
      variables: {
        userId,
        linkId
      },
      update: (store, { data: { createVote } }) => {
        this.updateStoreAfterVote(store, createVote, linkId);
      }
    })
    .subscribe();

    this.subscriptions = [...this.subscriptions, mutationSubscription];
  }

  humanizeDate(date: string) {
    return timeDifferenceForDate(date);
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}

// TODO: POST ISSUE: Imports and Position for the implementation of this interface are not clear from
// the tutorial.
// https://github.com/howtographql/howtographql/blob/master/content/frontend/angular-apollo/6-more-mutations-and-updating-the-store.md
// interface UpdateStoreAfterVoteCallback {
//   (proxy: DataProxy, mutationResult: FetchResult<CreateVoteMutationResponse>, linkId: string);
// }
