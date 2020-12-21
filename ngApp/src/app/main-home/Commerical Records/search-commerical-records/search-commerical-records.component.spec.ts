import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCommericalRecordsComponent } from './search-commerical-records.component';

describe('SearchCommericalRecordsComponent', () => {
  let component: SearchCommericalRecordsComponent;
  let fixture: ComponentFixture<SearchCommericalRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCommericalRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCommericalRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
