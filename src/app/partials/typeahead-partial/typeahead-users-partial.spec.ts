import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadUsersPartial } from './typeahead-users-partial';

describe('TypeaheadUsersPartial', () => {
  let component: TypeaheadUsersPartial;
  let fixture: ComponentFixture<TypeaheadUsersPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeaheadUsersPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeaheadUsersPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
