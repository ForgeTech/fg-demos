import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 1
import { LinkItemListComponent } from './component/link-item-list/link-item-list.component';
import { CreateLinkComponent } from './component/create-link/create-link.component';
import { LoginComponent } from './component/login/login.component';
import { SearchComponent } from './component/search/search.component';

/**
 * Setup all routes here
 */
const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/new/1'
    },
    {
        path: 'new/:page',
        component: LinkItemListComponent,
        pathMatch: 'full'
    },
    {
        path: 'top',
        component: LinkItemListComponent,
        pathMatch: 'full'
    },
    {
        path: 'create',
        component: CreateLinkComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'search',
        component: SearchComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [
        // 3
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
