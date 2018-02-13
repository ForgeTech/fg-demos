import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
// 1
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { GC_AUTH_TOKEN } from './constants';

@NgModule({
    exports: [
        // 2
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
    ],
})
export class GraphQLModule {
    // 3
    constructor(apollo: Apollo, httpLink: HttpLink) {
        // 4
        const uri = 'https://api.graph.cool/simple/v1/cjd7lhvu528sq0139ryabkjbk';

        const token = localStorage.getItem(GC_AUTH_TOKEN);
        const authorization = token ? `Bearer ${token}` : null;
        const headers = new HttpHeaders();
        headers.append('Authorization', authorization);

        const http = httpLink.create({ uri, headers });

        // 6
        apollo.create({
            link: http,
            cache: new InMemoryCache(),
        });
    }
}
