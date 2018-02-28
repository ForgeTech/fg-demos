import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GraphQLModule } from './apollo.config';

import { AppComponent } from './app.component';
import { LinkItemListComponent } from './component/link-item-list/link-item-list.component';
import { LinkItemComponent } from './component/link-item/link-item.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';

import { PageLinkComponent } from './component/page-link/page-link.component';
import { PageMainComponent } from './component/page-main/page-main.component';
import { PageTopComponent } from './component/page-top/page-top.component';
import { PageNewComponent } from './component/page-new/page-new.component';
import { PageCommentComponent } from './component/page-comment/page-comment.component';
import { PageCommentsComponent } from './component/page-comments/page-comments.component';
import { PageLinkSubmitComponent } from './component/page-link-submit/page-link-submit.component';
import { PageSearchComponent } from './component/page-search/page-search.component';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { PageUserComponent } from './component/page-user/page-user.component';
import { PageHttp404Component } from './component/page-http-404/page-http-404.component';

import { AuthService } from './auth.service';
import { CommentItemComponent } from './component/comment-item/comment-item.component';
import { CommentItemListComponent } from './component/comment-item-list/comment-item-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LinkItemComponent,
    LinkItemListComponent,
    HeaderComponent,
    FooterComponent,
    PageMainComponent,
    PageNewComponent,
    PageTopComponent,
    PageLinkSubmitComponent,
    PageLoginComponent,
    PageSearchComponent,
    PageHttp404Component,
    PageLinkComponent,
    PageCommentsComponent,
    PageCommentComponent,
    PageUserComponent,
    CommentItemComponent,
    CommentItemListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    GraphQLModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
