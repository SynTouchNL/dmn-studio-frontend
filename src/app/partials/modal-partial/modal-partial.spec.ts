import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPartial } from './modal-partial';

describe('ModalPartial', () => {
  let component: ModalPartial;
  let fixture: ComponentFixture<ModalPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
