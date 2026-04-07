import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacySecurityComponent } from './privacy-security';

describe('PrivacySecurityComponent', () => {
  let component: PrivacySecurityComponent;
  let fixture: ComponentFixture<PrivacySecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacySecurityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacySecurityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
