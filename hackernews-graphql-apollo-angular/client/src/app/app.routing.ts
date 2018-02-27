import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LinkItemListComponent } from './component/link-item-list/link-item-list.component';
import { CreateLinkComponent } from './component/create-link/create-link.component';
import { LoginComponent } from './component/login/login.component';
import { SearchComponent } from './component/search/search.component';
import { MainComponent } from './component/main/main.component';
import { TopComponent } from './component/top/top.component';
import { PageHttp404Component } from './component/page-http-404/page-http-404.component';
import { PageLinkComponent } from './component/page-link/page-link.component';

import {
    PAGINATION_PARAM_KEY,
    ROUTE_LINK_DEFAULT,
    ROUTE_LINK_ID_PARAM_KEY,
    ROUTE_LINKS_DEFAULT,
    ROUTE_LINKS_NEW,
    ROUTE_LINKS_TOP,
    ROUTE_COMMENTS_DEFAULT,
    ROUTE_COMMENT_DEFAULT,
    ROUTE_SUBMIT_DEFAULT,
    ROUTE_SEARCH_DEFAULT,
    ROUTE_LOGIN_DEFAULT,
    ROUTE_COMMENT_ID_PARAM_KEY,
    ROUTE_HTTP_404_DEFAULT,
    ROUTE_SEARCH_TERM_PARAM_KEY
} from './constants';

/**
 * The array of route-objects defining
 * the whole routeing-structure available
 * within the application
 */
const routes: Routes = [
    // If url ends after domain-part redirect
    // user to default-ordered links-page
    {
        path: '',
        pathMatch: 'full',
        redirectTo: [ROUTE_LINKS_DEFAULT, 1].join('/')
    },
    // Defines route to single link-page with attached link-id param-key
    // CAUTION! Make sure that if link-id parameter is not passed, user
    // is redirected to http-404
    {
        path: [ROUTE_LINK_DEFAULT, ROUTE_LINK_ID_PARAM_KEY].join('/'),
        component: PageLinkComponent,
        pathMatch: 'full'
    },
    // If pagination-parameter is not passed redirect user to
    // first default-ordered links-page
    {
        path: ROUTE_LINKS_DEFAULT,
        pathMatch: 'full',
        redirectTo: [ROUTE_LINKS_DEFAULT, 1].join('/')
    },
    // Defines route to default-ordered links-page with attached pagination param-key
    {
        path: [ROUTE_LINKS_DEFAULT, PAGINATION_PARAM_KEY].join('/'),
        component: MainComponent,
        pathMatch: 'full'
    },
    // If pagination-parameter is not passed redirect user to
    // first new links-page
    {
        path: ROUTE_LINKS_NEW,
        pathMatch: 'full',
        redirectTo: [ROUTE_LINKS_NEW, 1].join('/')
    },
    // Defines route to new-links-page with attached pagination param-key
    {
        path: [ROUTE_LINKS_NEW, PAGINATION_PARAM_KEY].join('/'),
        component: MainComponent,
        pathMatch: 'full'
    },
    // If pagination-parameter is not passed redirect user to
    // first ordered by most upvoted links-page
    {
        path: ROUTE_LINKS_TOP,
        pathMatch: 'full',
        redirectTo: [ROUTE_LINKS_TOP, 1].join('/')
    },
    // Defines route to ordere by most upvoted links-page with
    // attached pagination param-key
    {
        path: [ROUTE_LINKS_TOP, PAGINATION_PARAM_KEY].join('/'),
        component: TopComponent,
        pathMatch: 'full'
    },
    // Defines route to single comment-page with attached comment-id param-key
    // CAUTION! Make sure that if comment-id parameter is not passed, user
    // is redirected to http-404
    {
        path: [ROUTE_COMMENT_DEFAULT, ROUTE_COMMENT_ID_PARAM_KEY].join('/'),
        component: TopComponent,
        pathMatch: 'full'
    },
    // Defines route to 'Submit a new link'-page
    {
        path: ROUTE_SUBMIT_DEFAULT,
        component: CreateLinkComponent,
        pathMatch: 'full'
    },
    // Defines route to 'user login'-page
    {
        path: ROUTE_LOGIN_DEFAULT,
        component: LoginComponent,
        pathMatch: 'full'
    },
    // If 'search-term'-parameter is not passed redirect user to
    // 'empty-search-term'-page
    {
        path: ROUTE_SEARCH_DEFAULT,
        component: SearchComponent,
        pathMatch: 'full'
    },
    // Defines route to 'search links'-page with attached 'search-terms'
    // parameter
    {
        path: [ROUTE_SEARCH_DEFAULT, ROUTE_SEARCH_TERM_PARAM_KEY].join('/'),
        component: SearchComponent,
        pathMatch: 'full'
    },
    // Defines route to the applications http-status-404
    // 'page not found'-page
    {
        path: ROUTE_HTTP_404_DEFAULT,
        component: PageHttp404Component,
        pathMatch: 'full'
    },
    // CAUTION! This route makes sure all routes that don't
    // match the above definitions will be redirected to
    // http-404-page
    {
        path: '**',
        redirectTo: ROUTE_HTTP_404_DEFAULT,
    }
];

/**
 * Module setting up the angular-routing module
 * and the routes within the application
 * to allow injection into the main
 * application-module
*/
@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
