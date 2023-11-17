import { TestBed } from '@angular/core/testing';

import { RelancePrelevementResolver } from './relance-prelevement.resolver';

describe('RelancePrelevementResolver', () => {
  let resolver: RelancePrelevementResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RelancePrelevementResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
