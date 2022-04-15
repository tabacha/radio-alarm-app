import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WackupTimeEditComponent } from './wackup-time-edit.component';

describe('WackupTimeEditComponent', () => {
  let component: WackupTimeEditComponent;
  let fixture: ComponentFixture<WackupTimeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WackupTimeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WackupTimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
