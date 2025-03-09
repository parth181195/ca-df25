import { TestBed } from '@angular/core/testing';

import { NgxGradientService } from './ngx-gradient.service';

describe('NgxGradientService', () => {
  let service: NgxGradientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGradientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
