import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueComponentComponent } from './historique-component.component';

describe('HistoriqueComponentComponent', () => {
  let component: HistoriqueComponentComponent;
  let fixture: ComponentFixture<HistoriqueComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 
});
