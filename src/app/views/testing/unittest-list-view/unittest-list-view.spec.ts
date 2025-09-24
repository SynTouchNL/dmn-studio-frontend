import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnittestListView } from './unittest-list-view';

describe('UnittestListView', () => {
  let component: UnittestListView;
  let fixture: ComponentFixture<UnittestListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnittestListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnittestListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
