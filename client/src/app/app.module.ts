import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GraphQLModule } from './apollo.config';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
