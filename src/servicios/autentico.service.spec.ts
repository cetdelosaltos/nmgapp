import { TestBed } from '@angular/core/testing';

import { AutenticoService } from './autentico.service';

describe('AutenticoService', () => {
  let service: AutenticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
