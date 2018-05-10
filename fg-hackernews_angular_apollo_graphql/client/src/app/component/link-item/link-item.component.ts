import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Link } from '../../types';
import { timeDifferenceForDate } from './../../app.utils';
import { DataProxy } from 'apollo-cache';
import { Subscription } from 'rxjs/Subscription';
import {
  ROUTE_LINK_DEFAULT
} from './../../constants';
@Component({
  selector: 'hn-link-item',
  template: `
  <div class="flex mt2 items-start">
    <div class="flex items-center">
      <span class="gray">{{index+1}}.</span>
      <div *ngIf="isAuthenticated" class="ml1 gray f11 upvote" (click)="dispatchUpvoteEvent()">▲</div>
    </div>
    <div class="ml1">
      <a [href]="link.url" class="link">{{link.description}} ({{link.url}})</a>
      <div class="f6 lh-copy gray">
        {{link.voteCount}} votes
        | by {{link.postedBy ? link.postedBy.name : 'Unknown'}}
        | {{humanizeDate(link.createdAt)}}
        <a [routerLink]="['/${ROUTE_LINK_DEFAULT}', link.id]" class="no-underline gray">
        | Comments({{link.comments.length}})
        </a>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./link-item.component.css']
})
export class LinkItemComponent {
  @Input()
  link: Link;

  @Input()
  index: number = 0;

  @Input()
  isAuthenticated: boolean = false;

  @Output()
  linkUpvoteEvent: EventEmitter<LinkUpvoteEvent> = new EventEmitter<LinkUpvoteEvent>();

  constructor() {}

  humanizeDate(date: string) {
    return timeDifferenceForDate(date);
  }

  dispatchUpvoteEvent() {
    this.linkUpvoteEvent.emit(new LinkUpvoteEvent(this.link));
  }
}

export class LinkUpvoteEvent {
  constructor(private link: Link) {}
}
