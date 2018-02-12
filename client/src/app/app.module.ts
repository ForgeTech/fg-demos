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

@NgModule({
  declarations: [
    AppComponent,
    CreateLinkComponent,
    LinkItemComponent,
    LinkItemListComponent,
    HeaderComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
