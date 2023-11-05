import { Directive, Input, ElementRef, OnInit, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appStatusPill]'
})
export class StatusPillDirective implements OnInit, AfterViewInit {
  @Input() appStatusPill: any; // Input data for the directive
  @Input() statusArray: { value: string, color?: string }[]=[]; // Array of possible states with corresponding colors

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Check if the type is "status"
    if (this.appStatusPill.type === 'status') {
      // Find the corresponding color for the state
        const stateColor = this.statusArray.find(item => item.value === this.appStatusPill.value);
        let gradientColor:string="";
        if (stateColor) {
            // Apply gradient background
            gradientColor = `linear-gradient(90deg, ${stateColor.color} 0%, ${stateColor.color} 100%)`;
        }else{


        } 
        this.renderer.setStyle(this.el.nativeElement, 'background', gradientColor);
        // Create a pill-like appearance
        this.renderer.setStyle(this.el.nativeElement, 'border-radius', '999px');
        this.renderer.setStyle(this.el.nativeElement, 'padding', '4px 12px');
        this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
      
    }
  }

  ngAfterViewInit() {
    // Set the text content to the value
    this.el.nativeElement.textContent = this.appStatusPill.value;
  }
}
