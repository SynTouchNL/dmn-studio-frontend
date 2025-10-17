import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentDetailsView } from './deployment-details-view';

describe('DeploymentDetailsView', () => {
  let component: DeploymentDetailsView;
  let fixture: ComponentFixture<DeploymentDetailsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentDetailsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentDetailsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
