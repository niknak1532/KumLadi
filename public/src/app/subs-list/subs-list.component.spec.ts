import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsListComponent } from './subs-list.component';

describe('SubsListComponent', () => {
  let component: SubsListComponent;
  let fixture: ComponentFixture<SubsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
