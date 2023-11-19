import { Directive, Input, ElementRef, OnInit, Renderer2,AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appStatusPill]'
})
export class StatusPillDirective implements OnInit,AfterViewInit {
    @Input() appStatusPill: any; // Input data for the directive
    @Input() stateValue: any; // Input data for the directive
    responsiveSizes: { [key: string]: string }={ 'sm': 'text-sm', 'md': 'text-md', 'lg': 'text-lg', 'xl': 'text-xl', '2xl': 'text-2xl' }
    stateLabel="par defaut";

    constructor(private el: ElementRef, private renderer: Renderer2) { }
    
    ngOnInit() {
        const classes = [
            'flex',
            'items-center',
            'justify-center',
            'w-30',
            'text-sm',
            'font-bold',
            'h-8',
            'lg:rounded-full',
            'md:rounded-full',
            'text-white'
        ];
        if (this.appStatusPill.type === 'status') {
            let index = this.appStatusPill.statusValues.findIndex(item => item.value == this.stateValue);
            if(index>-1){
                this.renderer.setStyle(this.el.nativeElement, 'background', this.appStatusPill.statusValues[index]?.color?? '#808080');
                this.stateLabel=this.appStatusPill.statusValues[index]?.libelle??"par defaut";
            }else{
                this.renderer.setStyle(this.el.nativeElement, 'background', '#808080');
                this.stateLabel="par defaut";
            }
            classes.forEach(className => {
                this.renderer.addClass(this.el.nativeElement, className);
            });
        }
    }
    
    ngAfterViewInit() {
        this.el.nativeElement.textContent = this.stateLabel;
    }


}
