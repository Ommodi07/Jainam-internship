import { TestBed } from '@angular/core/testing';

import { CMSLibService } from './cms-lib.service';

describe('CMSLibService', () => {
  let service: CMSLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMSLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
