// wang_Yueqi_24832818
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory';
import { InventoryItem, Category, StockStatus } from '../../models/inventory-item';

// Define the inventory management page component
@Component({
  selector: 'app-inventory-manage',
  templateUrl: './inventory-manage.html',
  styleUrl: './inventory-manage.css',
  standalone: false
})
export class InventoryManageComponent implements OnInit {
  itemForm!: FormGroup;
  items: InventoryItem[] = [];
  popularItems: InventoryItem[] = [];
  message: string = '';

  categories: Category[] = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Other'];
  stockStatuses: StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock'];

  // Constructor to inject dependencies
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      supplierName: ['', Validators.required],
      stockStatus: ['', Validators.required],
      popular: [false, Validators.required],
      notes: ['']
    });

    this.loadItems();
  }

  loadItems(): void {
    this.items = this.inventoryService.getAllItems();
    this.popularItems = this.inventoryService.getPopularItems();
  }

  // Add a new item to the inventory
  addItem(): void {
    if (this.itemForm.invalid) {
      this.message = 'Please complete all required fields correctly.';
      return;
    }

    const success = this.inventoryService.addItem(this.itemForm.value);
    this.message = success
      ? 'Item added successfully.'
      : 'Item ID already exists.';

    if (success) {
      this.itemForm.reset({ quantity: 0, price: 0, popular: false });
      this.loadItems();
    }
  }

  // Update an existing item in the inventory
  updateItem(): void {
    if (this.itemForm.invalid) {
      this.message = 'Please complete all required fields correctly.';
      return;
    }

    const name = this.itemForm.value.name;
    const success = this.inventoryService.updateItemByName(name, this.itemForm.value);
    this.message = success
      ? 'Item updated successfully.'
      : 'Item not found by name.';
    this.loadItems();
  }

  // Delete an item from the inventory
  deleteItem(): void {
    const name = this.itemForm.value.name;

    if (!name) {
      this.message = 'Please enter the item name to delete.';
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) {
      this.message = 'Deletion cancelled.';
      return;
    }

    const success = this.inventoryService.deleteItemByName(name);
    this.message = success
      ? 'Item deleted successfully.'
      : 'Item not found by name.';

    if (success) {
      this.itemForm.reset({ quantity: 0, price: 0, popular: false });
    }

    this.loadItems();
  }
}