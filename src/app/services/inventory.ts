import { Injectable } from '@angular/core';
import { InventoryItem } from '../models/inventory-item';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private items: InventoryItem[] = [
    {
      id: 1,
      name: 'TV',
      category: 'Electronics',
      quantity: 12,
      price: 899,
      supplierName: 'Electronics Supplier',
      stockStatus: 'In Stock',
      popular: true,
      notes: 'Top showroom item'
    },
    {
      id: 2,
      name: 'Sofa',
      category: 'Furniture',
      quantity: 3,
      price: 1299,
      supplierName: 'Furniture Wholesale',
      stockStatus: 'Low Stock',
      popular: false,
      notes: ''
    },
    {
      id: 3,
      name: 'T-shirt',
      category: 'Clothing',
      quantity: 0,
      price: 9.9,
      supplierName: 'Clothing Direct',
      stockStatus: 'Out of Stock',
      popular: true,
      notes: ''
    }
  ];

  getAllItems(): InventoryItem[] {
    return [...this.items];
  }

  getPopularItems(): InventoryItem[] {
    return this.items.filter((item) => item.popular);
  }

  private normalizeId(id: string | number): string {
    return String(id).trim();
  }

  addItem(item: InventoryItem): boolean {
    const newItemId = this.normalizeId(item.id);
    const exists = this.items.some(
      (existingItem) => this.normalizeId(existingItem.id) === newItemId
    );

    if (exists) {
      return false;
    }

    this.items.push(item);
    return true;
  }

  updateItemByName(name: string, updatedItem: InventoryItem): boolean {
    const index = this.items.findIndex(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (index === -1) {
      return false;
    }

    this.items[index] = updatedItem;
    return true;
  }

  deleteItemByName(name: string): boolean {
    const index = this.items.findIndex(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  searchByName(keyword: string): InventoryItem[] {
    return this.items.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  searchAndFilter(
    keyword: string,
    category: string,
    stockStatus: string,
    popular: string
  ): InventoryItem[] {
    return this.items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword.toLowerCase());

      const matchesCategory =
        !category || item.category === category;

      const matchesStockStatus =
        !stockStatus || item.stockStatus === stockStatus;

      const matchesPopular =
        !popular ||
        (popular === 'Yes' && item.popular) ||
        (popular === 'No' && !item.popular);

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesStockStatus &&
        matchesPopular
      );
    });
  }
}