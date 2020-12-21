import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGovernatesComponent } from './list-governates.component';

describe('ListGovernatesComponent', () => {
  let component: ListGovernatesComponent;
  let fixture: ComponentFixture<ListGovernatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGovernatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGovernatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
