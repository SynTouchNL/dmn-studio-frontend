import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnCreateView } from './dmn-create-view';

describe('DmnCreateView', () => {
  let component: DmnCreateView;
  let fixture: ComponentFixture<DmnCreateView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnCreateView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnCreateView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
