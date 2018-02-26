import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { AppRoutingModule } from '../../app.routing';
import { Router } from '@angular/router';
import { AUTH_USER_ID } from './../../constants';
import {
  ALL_LINKS_QUERY,
  CREATE_LINK_MUTATION,
  CreateLinkMutationResponse
} from '../../graphql';

@Component({
  selector: 'hn-create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./create-link.component.css'],
})
export class CreateLinkComponent implements OnInit {
  description: String = '';
  url: String = '';
  apollo: Apollo;
  router: Router;

  constructor( apollo: Apollo, router: Router ) {
    this.apollo = apollo;
    this.router = router;
   }

  ngOnInit() { }

  createLink() {
    const postedById = localStorage.getItem(AUTH_USER_ID);
    if (!postedById) {
      console.error('No user logged in');
      return;
    }

    const newDescription = this.description;
    const newUrl = this.url;
    this.description = '';
    this.url = '';

    this.apollo.mutate<CreateLinkMutationResponse>({
      mutation: CREATE_LINK_MUTATION,
      variables: {
        description: newDescription,
        url: newUrl,
        voteCount: 0,
        commentCount: 0,
        postedById: postedById
      },
      update: (store, { data: { createLink } }) => {
        const data: any = store.readQuery({
          query: ALL_LINKS_QUERY,
          variables: {
            first: 25,
            skip: 0,
            orderBy: 'createdAt_DESC'
          }
        });
        data.allLinks.push(createLink);
        store.writeQuery({ query: ALL_LINKS_QUERY, data });
      },
    }).subscribe((response) => {
      console.log( 'CreateLink-Response:' );
      console.log( response );
      // We injected the Router service
      this.router.navigate(['/']);
    }, (error) => {
      console.error(error);
      this.description = newDescription;
      this.url = newUrl;
    });
  }
}
