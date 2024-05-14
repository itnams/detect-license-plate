import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-box-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxImageComponent {
  @Input() src: string = ''
}
