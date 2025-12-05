import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramCreateView } from './diagram-create-view';

describe('DiagramCreateView', () => {
  let component: DiagramCreateView;
  let fixture: ComponentFixture<DiagramCreateView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramCreateView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramCreateView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
