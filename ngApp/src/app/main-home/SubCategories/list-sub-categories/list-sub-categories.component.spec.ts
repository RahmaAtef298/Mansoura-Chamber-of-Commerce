import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubCategoriesComponent } from './list-sub-categories.component';

describe('ListSubCategoriesComponent', () => {
  let component: ListSubCategoriesComponent;
  let fixture: ComponentFixture<ListSubCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
