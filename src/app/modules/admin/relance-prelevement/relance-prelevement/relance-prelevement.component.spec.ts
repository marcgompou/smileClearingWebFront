import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelancePrelevementComponent } from './relance-prelevement.component';

describe('RelancePrelevementComponent', () => {
  let component: RelancePrelevementComponent;
  let fixture: ComponentFixture<RelancePrelevementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelancePrelevementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelancePrelevementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
