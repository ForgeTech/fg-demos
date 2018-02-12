import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Link } from '../../types';

// 1
import { ALL_LINKS_QUERY, AllLinkQueryResponse } from '../../graphql';

@Component({
  selector: 'hn-link-item-list',
  templateUrl: './link-item-list.component.html',
  styleUrls: ['./link-item-list.component.css']
})
export class LinkItemListComponent implements OnInit {
  // 2
  allLinks: Link[] = [];
  loading: Boolean = true;

  // 3
  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    // 4
    this.apollo.watchQuery<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY
    }).valueChanges.subscribe((response) => {
      // 5
      this.allLinks = response.data.allLinks;
      this.loading = response.data.loading;
    });

  }

}
