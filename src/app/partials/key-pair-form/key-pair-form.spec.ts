import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyPairForm } from './key-pair-form';

describe('KeyPairForm', () => {
  let component: KeyPairForm;
  let fixture: ComponentFixture<KeyPairForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyPairForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyPairForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
