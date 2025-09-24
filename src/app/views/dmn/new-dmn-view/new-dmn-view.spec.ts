import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDMNView } from './new-dmn-view';

describe('NewDMNView', () => {
  let component: NewDMNView;
  let fixture: ComponentFixture<NewDMNView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDMNView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDMNView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
