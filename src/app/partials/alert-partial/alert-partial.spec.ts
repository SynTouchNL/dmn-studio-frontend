import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPartial } from './alert-partial';

describe('AlertPartial', () => {
  let component: AlertPartial;
  let fixture: ComponentFixture<AlertPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
