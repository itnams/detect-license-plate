import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterEvent, RouterModule } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Component({
  selector: 'lib-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  url$ = new BehaviorSubject<string>('home')
  constructor(private  router: Router,
  ){
    this.router.events
    .pipe(filter((e) => e instanceof RouterEvent))
    .subscribe((e: any)=> {
      this.url$.next(e.url)
    });
  }
}
