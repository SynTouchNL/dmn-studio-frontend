import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexView } from './index-view';

describe('IndexView', () => {
  let component: IndexView;
  let fixture: ComponentFixture<IndexView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
