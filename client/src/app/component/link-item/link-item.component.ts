import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Link } from '../../types';
import { timeDifferenceForDate } from './../../app.utils';
import { DataProxy } from 'apollo-cache';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'hn-link-item',
  templateUrl: './link-item.component.html',
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
