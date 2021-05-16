import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVariantComponent } from './manage-variant.component';

describe('ManageVariantComponent', () => {
  let component: ManageVariantComponent;
  let fixture: ComponentFixture<ManageVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
