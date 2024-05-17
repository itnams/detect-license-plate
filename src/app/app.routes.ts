import { Route } from '@angular/router';
import { HomeComponent } from '@detect-license-plate/home';
import { LiveCameraComponent } from '@detect-license-plate/live-camera';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'live-camera', component: LiveCameraComponent }
];
