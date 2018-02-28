import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCommentsComponent } from './page-comments.component';

describe('PageCommentsComponent', () => {
  let component: PageCommentsComponent;
  let fixture: ComponentFixture<PageCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
