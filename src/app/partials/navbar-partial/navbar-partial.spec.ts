import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPartial } from './navbar-partial';

describe('NavbarPartial', () => {
  let component: NavbarPartial;
  let fixture: ComponentFixture<NavbarPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
