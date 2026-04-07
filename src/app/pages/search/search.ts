import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory';
import {
  InventoryItem,
  CATEGORY_OPTIONS,
  STOCK_STATUS_OPTIONS
} from '../../models/inventory-item';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent implements OnInit {
  items: InventoryItem[] = [];

  keyword: string = '';
  selectedCategory: string = '';
  selectedStockStatus: string = '';
  selectedPopular: string = '';

  categories = CATEGORY_OPTIONS;
  stockStatuses = STOCK_STATUS_OPTIONS;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadAllItems();
  }

  loadAllItems(): void {
    this.items = this.inventoryService.getAllItems();
  }

  searchItems(): void {
    this.items = this.inventoryService.searchAndFilter(
      this.keyword,
      this.selectedCategory,
      this.selectedStockStatus,
      this.selectedPopular
    );
  }

  showPopularOnly(): void {
    this.items = this.inventoryService.getPopularItems();
  }

  resetFilters(): void {
    this.keyword = '';
    this.selectedCategory = '';
    this.selectedStockStatus = '';
    this.selectedPopular = '';
    this.loadAllItems();
  }
}