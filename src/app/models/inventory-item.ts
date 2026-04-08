// wang_Yueqi_24832818

// Define available item categories
export type Category =
  | 'Electronics'
  | 'Furniture'
  | 'Clothing'
  | 'Tools'
  | 'Other';

// Define stock status types
export type StockStatus =
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock';

// Define the structure of an inventory item
export interface InventoryItem {
  id: number;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  popular: boolean;
  notes?: string;
}

// Category options for selection
export const CATEGORY_OPTIONS: Category[] = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Tools',
  'Other'
];

// Stock status options for selection
export const STOCK_STATUS_OPTIONS: StockStatus[] = [
  'In Stock',
  'Low Stock',
  'Out of Stock'
];