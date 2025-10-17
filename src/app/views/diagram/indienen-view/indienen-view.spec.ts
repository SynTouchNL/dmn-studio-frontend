import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndienenView } from './indienen-view';

describe('IndienenView', () => {
  let component: IndienenView;
  let fixture: ComponentFixture<IndienenView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndienenView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndienenView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
