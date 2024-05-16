import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateResults } from '@detect-license-plate/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-box-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-image.component.html',
  styleUrl: './box-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxImageComponent implements AfterViewInit{
  @Input() srcImg: string = ''
  @Input() results$ = new BehaviorSubject<PlateResults[]>([])
  @Input() imageWidth: number = 0
  constructor(){}
  ngAfterViewInit(): void { }
}
