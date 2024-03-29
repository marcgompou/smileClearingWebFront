import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseUtilsService } from '@fuse/services/utils';
import { any } from 'cypress/types/bluebird';
import { Subject } from 'rxjs';
import { Historique } from '../historique.type';

@Component({
  selector: 'app-historique',
  templateUrl: './historique-component.component.html',
  styleUrls: ['./historique-component.component.scss']
})
export class HistoriqueComponentComponent implements OnInit, AfterViewInit {

  // categories: Category[];
  // course: Course;
  currentStep: number = 0;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @Input("historiques") historiques:Historique[] ;
  @Input("stepsIsNumeroted") stepsIsNumeroted:boolean=false ;
  @Input("totalSteps") totalSteps:number ;
  @Input("validationUsers") validationUsers: string[][] = [];
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _changeDetectorRef: ChangeDetectorRef,
    // private _fuseAlertService: FuseAlertService,
    // private _fuseUtilsService: FuseUtilsService
    ) {

    
   }
    ngAfterViewInit(): void {
        let index: number = 0;
        let niveau: number = this.historiques?.length+1 ; // Déclaration et initialisation de la variable index
    console.log("validationUsers******",this.validationUsers)
        if(this.historiques?.length<this.totalSteps )
        {
          
            while(this.historiques.length<this.totalSteps)
            {
                this.historiques.push({
                    listeValideurs : this.validationUsers[index] ? this.validationUsers[index] : [],
                    niveau : niveau,
                    traite : false
                } as Historique);
                index++;
                niveau++;
            }
    
        };
    }

  ngOnInit(): void {
   
  }

  goToStep(step: number): void
    {
        // Set the current step
        this.currentStep = step;

        this._changeDetectorRef.markForCheck();
    }

    /**
     * Go to previous step
     */
    goToPreviousStep(): void
    {
        // Return if we already on the first step
        if ( this.currentStep === 0 )
        {
            return;
        }

        // Go to step
        this.goToStep(this.currentStep - 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
    }

    /**
     * Go to next step
     */
    goToNextStep(): void
    {
        // Return if we already on the last step
        // if ( this.currentStep === this.course.totalSteps - 1 )
        // {
        //     return;
        // }

        // Go to step
        this.goToStep(this.currentStep + 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    private _scrollCurrentStepElementIntoView(): void
    {
        // Wrap everything into setTimeout so we can make sure that the 'current-step' class points to correct element
        setTimeout(() => {

            // Get the current step element and scroll it into view
            const currentStepElement = this._document.getElementsByClassName('current-step')[0];
            if ( currentStepElement )
            {
                currentStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block   : 'start'
                });
            }
        });
    }
}
