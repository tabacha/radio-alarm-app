import { TestBed } from '@angular/core/testing';

import { RadioStatusService } from './radio-status.service';

describe('RadioStatusService', () => {
  let service: RadioStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
