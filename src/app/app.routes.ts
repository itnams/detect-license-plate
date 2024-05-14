import { Route } from '@angular/router';
import { HomeComponent } from '@detect-license-plate/home';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
];
