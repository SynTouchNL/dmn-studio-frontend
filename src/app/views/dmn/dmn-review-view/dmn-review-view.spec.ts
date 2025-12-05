import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmnReviewView } from './dmn-review-view';

describe('DmnReviewView', () => {
  let component: DmnReviewView;
  let fixture: ComponentFixture<DmnReviewView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmnReviewView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmnReviewView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
