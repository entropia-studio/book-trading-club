import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestnewComponent } from './requestnew.component';

describe('RequestnewComponent', () => {
  let component: RequestnewComponent;
  let fixture: ComponentFixture<RequestnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
