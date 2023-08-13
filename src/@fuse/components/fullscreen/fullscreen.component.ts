import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FSDocument, FSDocumentElement } from '@fuse/components/fullscreen/fullscreen.types';

@Component({
    selector       : 'fuse-fullscreen',
    templateUrl    : './fullscreen.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'fuseFullscreen'
})
export class FuseFullscreenComponent implements OnInit
{
    @Input() iconTpl: TemplateRef<any>;
    @Input() tooltip: string;
    private _fsDoc: FSDocument;
    private _fsDocEl: FSDocumentElement;
    private _isFullscreen: boolean = false;

    /**
     * Constructor
     */
    constructor(@Inject(DOCUMENT) private _document: Document)
    {
        this._fsDoc = _document as FSDocument;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._fsDocEl = document.documentElement as FSDocumentElement;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the fullscreen mode
     */
    toggleFullscreen(): void
    {
        // Check if the fullscreen is open
        this._isFullscreen = this._getBrowserFullscreenElement() !== null;

        // Toggle the fullscreen
        if ( this._isFullscreen )
        {
            this._closeFullscreen();
        }
        else
        {
            this._openFullscreen();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get browser's fullscreen element
     *
     * @private
     */
    private _getBrowserFullscreenElement(): Element
    {
        if ( typeof this._fsDoc.fullscreenElement !== 'undefined' )
        {
            return this._fsDoc.fullscreenElement;
        }

        if ( typeof this._fsDoc.mozFullScreenElement !== 'undefined' )
        {
            return this._fsDoc.mozFullScreenElement;
        }

        if ( typeof this._fsDoc.msFullscreenElement !== 'undefined' )
        {
            return this._fsDoc.msFullscreenElement;
        }

        if ( typeof this._fsDoc.webkitFullscreenElement !== 'undefined' )
        {
            return this._fsDoc.webkitFullscreenElement;
        }

        throw new Error('Fullscreen mode is not supported by this browser');
    }

    /**
     * Open the fullscreen
     *
     * @private
     */
    private _openFullscreen(): void
    {
        if ( this._fsDocEl.requestFullscreen )
        {
            this._fsDocEl.requestFullscreen();
        }

        // Firefox
        if ( this._fsDocEl.mozRequestFullScreen )
        {
            this._fsDocEl.mozRequestFullScreen();
        }

        // Chrome, Safari and Opera
        if ( this._fsDocEl.webkitRequestFullscreen )
        {
            this._fsDocEl.webkitRequestFullscreen();
           
        }

        // IE/Edge
        if ( this._fsDocEl.msRequestFullscreen )
        {
            this._fsDocEl.msRequestFullscreen();
            
        }
    }

    /**
     * Close the fullscreen
     *
     * @private
     */
    private _closeFullscreen(): void
    {
        if ( this._fsDoc.exitFullscreen )
        {
            this._fsDoc.exitFullscreen();
            
        }

        // Firefox
        if ( this._fsDoc.mozCancelFullScreen )
        {
            this._fsDoc.mozCancelFullScreen();
            
        }

        // Chrome, Safari and Opera
        if ( this._fsDoc.webkitExitFullscreen )
        {
            this._fsDoc.webkitExitFullscreen();
            
        }

        // IE/Edge
        else if ( this._fsDoc.msExitFullscreen )
        {
            this._fsDoc.msExitFullscreen();
            
        }
    }
}
