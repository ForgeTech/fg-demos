import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLinkSubmitComponent } from './page-submit-link.component';

describe('PageLinkSubmitComponent', () => {
  let component: PageLinkSubmitComponent;
  let fixture: ComponentFixture<PageLinkSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLinkSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLinkSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
