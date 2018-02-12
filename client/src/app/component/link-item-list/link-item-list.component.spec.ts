import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkItemListComponent } from './link-item-list.component';

describe('LinkItemListComponent', () => {
  let component: LinkItemListComponent;
  let fixture: ComponentFixture<LinkItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
