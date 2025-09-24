import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnittestDetailView } from './unittest-detail-view';

describe('UnittestDetailView', () => {
  let component: UnittestDetailView;
  let fixture: ComponentFixture<UnittestDetailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnittestDetailView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnittestDetailView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
