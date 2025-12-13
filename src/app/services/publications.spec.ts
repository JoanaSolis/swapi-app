import { TestBed } from '@angular/core/testing';

import { Publications } from './publications';

describe('Publications', () => {
  let service: Publications;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Publications);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
