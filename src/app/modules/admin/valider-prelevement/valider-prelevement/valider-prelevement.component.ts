import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "prelevement-valider",
  templateUrl: "./valider-prelevement.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrelevementValiderComponent {
  /**
   * Constructor
   */
  constructor() {}
}
