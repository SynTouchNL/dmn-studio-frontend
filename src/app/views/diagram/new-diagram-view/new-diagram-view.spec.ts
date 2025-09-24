import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDiagramView } from './new-diagram-view';

describe('NewDiagramView', () => {
  let component: NewDiagramView;
  let fixture: ComponentFixture<NewDiagramView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDiagramView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDiagramView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
