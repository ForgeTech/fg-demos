import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHttp404Component } from './page-http-404.component';

describe('PageHttp404Component', () => {
  let component: PageHttp404Component;
  let fixture: ComponentFixture<PageHttp404Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageHttp404Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHttp404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
