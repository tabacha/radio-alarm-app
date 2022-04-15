import { TestBed } from '@angular/core/testing';

import { WackupTimeService } from './wackup-time.service';

describe('WackupTimeService', () => {
  let service: WackupTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WackupTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
