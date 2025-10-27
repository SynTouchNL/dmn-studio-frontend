import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsListView } from './deployments-list-view';

describe('DeploymentsListView', () => {
  let component: DeploymentsListView;
  let fixture: ComponentFixture<DeploymentsListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentsListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentsListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
