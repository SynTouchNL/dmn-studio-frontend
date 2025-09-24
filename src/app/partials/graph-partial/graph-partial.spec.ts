import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPartial } from './graph-partial';

describe('GraphPartial', () => {
  let component: GraphPartial;
  let fixture: ComponentFixture<GraphPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
