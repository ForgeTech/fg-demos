import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageLinkComponent } from './component/page-link/page-link.component';
import { PageMainComponent } from './component/page-main/page-main.component';
import { PageNewComponent } from './component/page-new/page-new.component';
import { PageTopComponent } from './component/page-top/page-top.component';
import { PageCommentComponent } from './component/page-comment/page-comment.component';
import { PageCommentsComponent } from './component/page-comments/page-comments.component';
import { PageLinkSubmitComponent } from './component/page-link-submit/page-link-submit.component';
import { PageSearchComponent } from './component/page-search/page-search.component';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { PageUserComponent } from './component/page-user/page-user.component';
import { PageHttp404Component } from './component/page-http-404/page-http-404.component';

import {
    PAGINATION_PARAM_KEY,
    ROUTE_LINK_DEFAULT,
    ROUTE_LINK_ID_PARAM_KEY,
    ROUTE_LINKS_DEFAULT,
    ROUTE_LINKS_NEW,
    ROUTE_LINKS_TOP,
    ROUTE_COMMENT_DEFAULT,
    ROUTE_COMMENT_ID_PARAM_KEY,
    ROUTE_COMMENTS_DEFAULT,
    ROUTE_SUBMIT_DEFAULT,
    ROUTE_SEARCH_DEFAULT,
    ROUTE_SEARCH_TERM_PARAM_KEY,
    ROUTE_LOGIN_DEFAULT,
    ROUTE_USER_DEFAULT,
    ROUTE_USER_ID_PARAM_KEY,
    ROUTE_HTTP_404_DEFAULT,
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
        component: PageMainComponent,
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
        component: PageNewComponent,
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
        component: PageTopComponent,
        pathMatch: 'full'
    },
    // Defines route to single comment-page with attached comment-id param-key
    // CAUTION! Make sure that if comment-id parameter is not passed, user
    // is redirected to http-404
    {
        path: [ROUTE_COMMENT_DEFAULT, ROUTE_COMMENT_ID_PARAM_KEY].join('/'),
        component: PageCommentComponent,
        pathMatch: 'full'
    },
    // If pagination-parameter is not passed redirect user to
    // first page of top-voted comments
    {
        path: ROUTE_COMMENTS_DEFAULT,
        pathMatch: 'full',
        redirectTo: [ROUTE_COMMENTS_DEFAULT, 1].join('/')
    },
    // Defines route to page holding top-voted comments with
    // attached pagination param-key
    {
        path: [ROUTE_COMMENTS_DEFAULT, PAGINATION_PARAM_KEY].join('/'),
        component: PageCommentsComponent,
        pathMatch: 'full'
    },
    // Defines route to 'Submit a new link'-page
    {
        path: ROUTE_SUBMIT_DEFAULT,
        component: PageLinkSubmitComponent,
        pathMatch: 'full'
    },
    // If 'search-term'-parameter is not passed redirect user to
    // 'empty-search-term'-page
    {
        path: ROUTE_SEARCH_DEFAULT,
        component: PageSearchComponent,
        pathMatch: 'full'
    },
    // Defines route to 'search links'-page with attached 'search-terms'
    // parameter
    {
        path: [ROUTE_SEARCH_DEFAULT, ROUTE_SEARCH_TERM_PARAM_KEY].join('/'),
        component: PageSearchComponent,
        pathMatch: 'full'
    },
    // Defines route to 'user login'-page
    {
        path: ROUTE_LOGIN_DEFAULT,
        component: PageLoginComponent,
        pathMatch: 'full'
    },
    // Defines route to user-profile with attached user-id param-key
    // CAUTION! Make sure that if user-id parameter is not passed, user
    // is redirected to http-404
    {
        path: [ROUTE_USER_DEFAULT, ROUTE_USER_ID_PARAM_KEY].join('/'),
        component: PageUserComponent,
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
