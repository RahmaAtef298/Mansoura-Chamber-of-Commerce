import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShahrAqaryComponent } from './list-shahr-aqary.component';

describe('ListShahrAqaryComponent', () => {
  let component: ListShahrAqaryComponent;
  let fixture: ComponentFixture<ListShahrAqaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListShahrAqaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShahrAqaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
