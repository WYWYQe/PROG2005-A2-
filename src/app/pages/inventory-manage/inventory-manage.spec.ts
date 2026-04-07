import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManageComponent } from './inventory-manage';

describe('InventoryManageComponent', () => {
  let component: InventoryManageComponent;
  let fixture: ComponentFixture<InventoryManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryManageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
