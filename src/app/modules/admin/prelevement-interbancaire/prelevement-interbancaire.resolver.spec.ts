import { TestBed } from '@angular/core/testing';

import { PrelevementInterbancaireResolver } from './prelevement-interbancaire.resolver';

describe('PrelevementInterbancaireResolver', () => {
  let resolver: PrelevementInterbancaireResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PrelevementInterbancaireResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
