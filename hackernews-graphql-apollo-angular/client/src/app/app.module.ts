import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { GraphQLModule } from './apollo.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CreateLinkComponent } from './component/create-link/create-link.component';
import { LinkItemComponent } from './component/link-item/link-item.component';
import { LinkItemListComponent } from './component/link-item-list/link-item-list.component';
import { HeaderComponent } from './component/header/header.component';
import { LoginComponent } from './component/login/login.component';
import { AuthService } from './auth.service';
import { SearchComponent } from './component/search/search.component';
import { MainComponent } from './component/main/main.component';
import { FooterComponent } from './component/footer/footer.component';
import { TopComponent } from './component/top/top.component';
import { PageHttp404Component } from './component/page-http-404/page-http-404.component';
import { PageLinkComponent } from './component/page-link/page-link.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateLinkComponent,
    LinkItemComponent,
    LinkItemListComponent,
    HeaderComponent,
    LoginComponent,
    SearchComponent,
    MainComponent,
    FooterComponent,
    TopComponent,
    PageHttp404Component,
    PageLinkComponent
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
