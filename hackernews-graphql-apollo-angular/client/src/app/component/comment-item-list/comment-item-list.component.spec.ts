import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentItemListComponent } from './comment-item-list.component';

describe('CommentItemListComponent', () => {
  let component: CommentItemListComponent;
  let fixture: ComponentFixture<CommentItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
