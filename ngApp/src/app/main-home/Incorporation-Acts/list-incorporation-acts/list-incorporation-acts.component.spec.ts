import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIncorporationActsComponent } from './list-incorporation-acts.component';

describe('ListIncorporationActsComponent', () => {
  let component: ListIncorporationActsComponent;
  let fixture: ComponentFixture<ListIncorporationActsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIncorporationActsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIncorporationActsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
