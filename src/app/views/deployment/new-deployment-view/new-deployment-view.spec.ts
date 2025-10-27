import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeploymentView } from './new-deployment-view';

describe('NewDeploymentView', () => {
  let component: NewDeploymentView;
  let fixture: ComponentFixture<NewDeploymentView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDeploymentView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDeploymentView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
