import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingSubscriptionComponent } from './onboarding-subscription.component';

describe('OnboardingSubscriptionComponent', () => {
  let component: OnboardingSubscriptionComponent;
  let fixture: ComponentFixture<OnboardingSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
