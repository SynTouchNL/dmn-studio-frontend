import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarPartial } from './searchbar-partial';

describe('SearchbarPartial', () => {
  let component: SearchbarPartial;
  let fixture: ComponentFixture<SearchbarPartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarPartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchbarPartial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
