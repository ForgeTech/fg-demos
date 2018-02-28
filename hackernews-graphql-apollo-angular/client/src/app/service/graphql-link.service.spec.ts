import { TestBed, inject } from '@angular/core/testing';

import { GraphqlLinkService } from './graphql-link.service';

describe('GraphqlLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphqlLinkService]
    });
  });

  it('should be created', inject([GraphqlLinkService], (service: GraphqlLinkService) => {
    expect(service).toBeTruthy();
  }));
});
