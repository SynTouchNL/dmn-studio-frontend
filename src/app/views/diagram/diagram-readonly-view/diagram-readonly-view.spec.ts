import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramReadonlyView } from './diagram-readonly-view';

describe('DiagramReadonlyView', () => {
  let component: DiagramReadonlyView;
  let fixture: ComponentFixture<DiagramReadonlyView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramReadonlyView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramReadonlyView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
