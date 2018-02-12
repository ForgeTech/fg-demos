import { Component, Input, OnInit } from '@angular/core';
import { Link } from '../../types';

@Component({
  selector: 'hn-link-item',
  templateUrl: './link-item.component.html',
  styleUrls: ['./link-item.component.css']
})
export class LinkItemComponent implements OnInit {
  @Input()
  link: Link;

  constructor() {
  }

  ngOnInit() {
  }

  voteForLink = async () => {
    // ... you'll implement this in chapter 6
  }
}
