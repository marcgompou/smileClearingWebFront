import { Component, Input } from '@angular/core';
import { Historique } from '../historique.types';

@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent {

  @Input('_historiques') _historiques:Historique[];


}
