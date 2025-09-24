import { TestBed } from '@angular/core/testing';

import { DmnService } from './dmn-service';

describe('DmnService', () => {
  let service: DmnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
