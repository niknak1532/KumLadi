import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiblingPostsComponent } from './sibling-posts.component';

describe('SiblingPostsComponent', () => {
  let component: SiblingPostsComponent;
  let fixture: ComponentFixture<SiblingPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiblingPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiblingPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
