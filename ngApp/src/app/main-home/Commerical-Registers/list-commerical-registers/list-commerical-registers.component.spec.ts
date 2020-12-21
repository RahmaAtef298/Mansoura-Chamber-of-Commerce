import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommericalRegistersComponent } from './list-commerical-registers.component';

describe('ListCommericalRegistersComponent', () => {
  let component: ListCommericalRegistersComponent;
  let fixture: ComponentFixture<ListCommericalRegistersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCommericalRegistersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCommericalRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
