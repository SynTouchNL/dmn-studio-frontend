import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnListView } from './dmn-list-view';

describe('DmnListView', () => {
  let component: DmnListView;
  let fixture: ComponentFixture<DmnListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
