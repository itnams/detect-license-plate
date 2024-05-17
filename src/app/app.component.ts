import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NavigationBarComponent } from '@detect-license-plate/navigation-bar';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, NavigationBarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'detect-license-plate';
}
