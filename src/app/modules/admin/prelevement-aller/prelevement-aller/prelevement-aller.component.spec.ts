import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrelevementAllerComponent } from './prelevement-aller.component';

describe('PrelevementAllerComponent', () => {
  let component: PrelevementAllerComponent;
  let fixture: ComponentFixture<PrelevementAllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrelevementAllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrelevementAllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
