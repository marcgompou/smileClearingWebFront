import { TestBed } from '@angular/core/testing';

import { PrelevementAllerService } from './prelevement-aller.service';

describe('PrelevementAllerService', () => {
  let service: PrelevementAllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrelevementAllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
