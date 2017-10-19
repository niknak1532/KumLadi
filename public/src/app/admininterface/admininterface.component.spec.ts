import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmininterfaceComponent } from './admininterface.component';

describe('AdmininterfaceComponent', () => {
  let component: AdmininterfaceComponent;
  let fixture: ComponentFixture<AdmininterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmininterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmininterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
