import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateResults } from '@detect-license-plate/models';

@Component({
  selector: 'lib-box-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-image.component.html',
  styleUrl: './box-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxImageComponent {
  @Input() srcImg: string = ''
  @Input() results: PlateResults[] = []
  @Input() imageWidth: number = 0
  constructor(){
    console.log(this.results)
  }
}
