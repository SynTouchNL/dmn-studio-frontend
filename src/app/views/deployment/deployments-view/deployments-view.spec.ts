import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsView } from './deployments-view';

describe('DeploymentsView', () => {
  let component: DeploymentsView;
  let fixture: ComponentFixture<DeploymentsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
