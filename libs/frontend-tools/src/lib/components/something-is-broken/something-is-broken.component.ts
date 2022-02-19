import { Component, Input } from '@angular/core';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';


@Component({
  selector: 'mathpoc-something-is-broken',
  templateUrl: './something-is-broken.component.html',
  styleUrls: ['./something-is-broken.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SomethingIsBrokenComponent {
  @Input() statusCode = '404';
  @Input() statusMessage = '';
}
