import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrelevementInterbancaireComponent } from './prelevement-interbancaire.component';

describe('PrelevementInterbancaireComponent', () => {
  let component: PrelevementInterbancaireComponent;
  let fixture: ComponentFixture<PrelevementInterbancaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrelevementInterbancaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrelevementInterbancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
