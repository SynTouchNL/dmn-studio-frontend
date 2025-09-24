import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnListPartial } from './dmn-list-partial';

describe('DmnListPartial', () => {
  let component: DmnListPartial;
  let fixture: ComponentFixture<DmnListPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnListPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnListPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
