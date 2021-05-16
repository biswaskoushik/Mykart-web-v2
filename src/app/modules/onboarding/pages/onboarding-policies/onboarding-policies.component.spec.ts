import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingPoliciesComponent } from './onboarding-policies.component';

describe('OnboardingPoliciesComponent', () => {
  let component: OnboardingPoliciesComponent;
  let fixture: ComponentFixture<OnboardingPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingPoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
