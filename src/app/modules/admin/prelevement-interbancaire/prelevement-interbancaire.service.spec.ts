import { TestBed } from '@angular/core/testing';

import { PrelevementInterbancaireService } from './prelevement-interbancaire.service';

describe('PrelevementInterbancaireService', () => {
  let service: PrelevementInterbancaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrelevementInterbancaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
