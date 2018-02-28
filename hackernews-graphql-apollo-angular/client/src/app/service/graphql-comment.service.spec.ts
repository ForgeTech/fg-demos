import { TestBed, inject } from '@angular/core/testing';

import { GraphqlCommentService } from './graphql-comment.service';

describe('GraphqlCommentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphqlCommentService]
    });
  });

  it('should be created', inject([GraphqlCommentService], (service: GraphqlCommentService) => {
    expect(service).toBeTruthy();
  }));
});
