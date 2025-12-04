import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramSubmitView } from './diagram-submit-view';

describe('DiagramSubmitView', () => {
  let component: DiagramSubmitView;
  let fixture: ComponentFixture<DiagramSubmitView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramSubmitView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramSubmitView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
