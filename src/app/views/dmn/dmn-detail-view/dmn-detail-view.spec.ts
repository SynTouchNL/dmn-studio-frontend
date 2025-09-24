import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnDetailView } from './dmn-detail-view';

describe('DmnDetailView', () => {
  let component: DmnDetailView;
  let fixture: ComponentFixture<DmnDetailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnDetailView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnDetailView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
