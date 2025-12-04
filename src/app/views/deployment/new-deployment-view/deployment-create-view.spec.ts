import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentCreateView } from './deployment-create-view';

describe('DeploymentCreateView', () => {
  let component: DeploymentCreateView;
  let fixture: ComponentFixture<DeploymentCreateView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentCreateView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentCreateView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
