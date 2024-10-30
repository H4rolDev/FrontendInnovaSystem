import { TestBed } from '@angular/core/testing';

import { TechnicalServiceService } from './technical-service.service';

describe('TechnicalServiceService', () => {
  let service: TechnicalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
