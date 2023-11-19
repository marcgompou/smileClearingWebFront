import { Directive, Input, ElementRef, OnInit, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appStatusPill]'
})
export class StatusPillDirective implements OnInit, AfterViewInit {
  @Input() appStatusPill: any; // Input data for the directive
  @Input() stateValue: any; // Input data for the directive

  stateLabel = "par defaut";

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const classes = [
      'flex',
      'items-center',
      'justify-center',
      'text-sm',
      'font-bold',
      'h-8',
      'rounded-full',
      'text-white'
    ];

    if (this.appStatusPill.type === 'status') {
      let index = this.appStatusPill.statusValues.findIndex(item => item.value == this.stateValue);
      if (index > -1) {
        this.renderer.setStyle(this.el.nativeElement, 'background', this.appStatusPill.statusValues[index]?.color ?? '#808080');
        this.stateLabel = this.appStatusPill.statusValues[index]?.libelle ?? "par defaut";
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'background', '#808080');
        this.stateLabel = "par defaut";
      }
      classes.forEach(className => {
        this.renderer.addClass(this.el.nativeElement, className);
      });

      // Check for small screens and hide pills
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        this.renderer.addClass(this.el.nativeElement, 'hidden-on-small-screen');
      }
    }
  }

  ngAfterViewInit() {
    this.el.nativeElement.textContent = this.stateLabel;
  }
}
