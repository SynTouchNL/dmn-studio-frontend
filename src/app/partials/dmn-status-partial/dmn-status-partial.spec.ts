import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnStatusPartial } from './dmn-status-partial';

describe('DmnStatusPartial', () => {
  let component: DmnStatusPartial;
  let fixture: ComponentFixture<DmnStatusPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnStatusPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnStatusPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
