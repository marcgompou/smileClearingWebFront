import { Component, ViewEncapsulation } from '@angular/core';
import { ChangeDetectionStrategy, 
    //ChangeDetectorRef, 
 OnDestroy, OnInit  } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

@Component({
    selector     : 'home',
    templateUrl  : './home.component.html',
    styleUrls    : ['./home.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
    
})
export class HomeComponent implements OnInit, OnDestroy
{
 
constructor()
{
}
ngOnInit(): void
{ 

}

/**
 * On destroy
 */
ngOnDestroy(): void
{
 
}

// -----------------------------------------------------------------------------------------------------
// @ Public methods
// -----------------------------------------------------------------------------------------------------

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
    
}
