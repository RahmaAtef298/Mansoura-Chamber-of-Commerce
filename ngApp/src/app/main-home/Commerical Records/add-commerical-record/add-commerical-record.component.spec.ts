import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommericalRecordComponent } from './add-commerical-record.component';

describe('AddCommericalRecordComponent', () => {
  let component: AddCommericalRecordComponent;
  let fixture: ComponentFixture<AddCommericalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommericalRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommericalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
