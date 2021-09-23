import { TestBed } from '@angular/core/testing';

import { TheBlueAllianceService } from './the-blue-alliance.service';

describe('TheBlueAllianceService', () => {
  let service: TheBlueAllianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheBlueAllianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
