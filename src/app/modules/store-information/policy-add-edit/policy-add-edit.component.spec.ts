import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAddEditComponent } from './policy-add-edit.component';

describe('PolicyAddEditComponent', () => {
  let component: PolicyAddEditComponent;
  let fixture: ComponentFixture<PolicyAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
