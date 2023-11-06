import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appStatusPill]'
})
export class StatusPillDirective implements OnInit {
    @Input() appStatusPill: any; // Input data for the directive
    @Input() stateColor: any; // Input data for the directive


    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {

        console.log("===appStatusPill==>", this.appStatusPill);

        console.log("===stateColor==>", this.stateColor);

        if (this.appStatusPill.type === 'status') {

            this.renderer.setStyle(this.el.nativeElement, 'background', this.stateColor??"gray");
            this.renderer.setStyle(this.el.nativeElement, 'border-radius', '999px');
            this.renderer.setStyle(this.el.nativeElement, 'padding', '4px 20px');
            this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
        }
    }



}
