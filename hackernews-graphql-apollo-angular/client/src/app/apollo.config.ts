import { NgModule } from '@angular/core';
import {
    HttpClientModule,
    HttpHeaders
} from '@angular/common/http';
import {
    Apollo,
    ApolloModule
} from 'apollo-angular';
import {
    HttpLink,
    HttpLinkModule
} from 'apollo-angular-link-http';
// CAUTION! After adding this package additional
// npm package 'subscriptions-transport-ws' needed to
// be installed, also to fix " Cannot find name 'AsyncIterator'." Error
// ( https://github.com/apollographql/graphql-subscriptions/issues/83 )
// esnext had to be added to lib section of tsconfig.json
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getOperationAST } from 'graphql';
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

    constructor(apollo: Apollo, httpLink: HttpLink) {
        const uri = 'https://api.graph.cool/simple/v1/cjd7lhvu528sq0139ryabkjbk';
        const token = localStorage.getItem(GC_AUTH_TOKEN);
        const authorization = token ? `Bearer ${token}` : null;
        const headers = new HttpHeaders();
        headers.append('Authorization', authorization);

        const http = httpLink.create({ uri, headers });

        const ws = new WebSocketLink({
            uri: `wss://subscriptions.graph.cool/v1/cjd7lhvu528sq0139ryabkjbk`,
            options: {
                reconnect: true,
                connectionParams: {
                    authToken: localStorage.getItem(GC_AUTH_TOKEN),
                }
            }
        });

        apollo.create({
            // 2
            link: ApolloLink.split(
                // 3
                operation => {
                    const operationAST = getOperationAST(operation.query, operation.operationName);
                    return !!operationAST && operationAST.operation === 'subscription';
                },
                ws,
                http,
            ),
            cache: new InMemoryCache()
        });
    }
}
