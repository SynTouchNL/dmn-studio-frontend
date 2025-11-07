import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnittestCreateView } from './unittest-create-view';

describe('UnittestCreateView', () => {
  let component: UnittestCreateView;
  let fixture: ComponentFixture<UnittestCreateView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnittestCreateView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnittestCreateView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
