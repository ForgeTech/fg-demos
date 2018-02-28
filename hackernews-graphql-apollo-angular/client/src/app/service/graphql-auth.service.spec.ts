import { TestBed, inject } from '@angular/core/testing';

import { GraphqlAuthService } from './graphql-auth.service';

describe('GraphqlAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphqlAuthService]
    });
  });

  it('should be created', inject([GraphqlAuthService], (service: GraphqlAuthService) => {
    expect(service).toBeTruthy();
  }));
});
