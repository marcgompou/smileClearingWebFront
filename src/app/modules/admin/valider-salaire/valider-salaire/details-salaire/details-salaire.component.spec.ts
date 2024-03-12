import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPrelevementComponent } from './details-prelevement.component';

describe('DetailsPrelevementComponent', () => {
  let component: DetailsPrelevementComponent;
  let fixture: ComponentFixture<DetailsPrelevementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsPrelevementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPrelevementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
