import { TestBed } from '@angular/core/testing';

import { KeyCloakService } from './key-cloak-service';

describe('KeyCloakService', () => {
  let service: KeyCloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyCloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
