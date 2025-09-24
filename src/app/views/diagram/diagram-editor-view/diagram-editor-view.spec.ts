import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramEditorView } from './diagram-editor-view';

describe('DiagramEditorView', () => {
  let component: DiagramEditorView;
  let fixture: ComponentFixture<DiagramEditorView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramEditorView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramEditorView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
