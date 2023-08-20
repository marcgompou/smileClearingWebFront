import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRemiseComponent } from './details-remise.component';

describe('DetailsRemiseComponent', () => {
  let component: DetailsRemiseComponent;
  let fixture: ComponentFixture<DetailsRemiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsRemiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsRemiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
