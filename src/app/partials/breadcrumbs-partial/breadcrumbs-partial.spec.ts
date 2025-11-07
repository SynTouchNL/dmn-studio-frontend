import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsPartial } from './breadcrumbs-partial';

describe('BreadcrumbsPartial', () => {
  let component: BreadcrumbsPartial;
  let fixture: ComponentFixture<BreadcrumbsPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
