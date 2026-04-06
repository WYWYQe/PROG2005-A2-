import type {
  InventoryItem,
  ItemCategory,
  ItemUpdatePatch,
  NewItemInput,
  PopularFlag,
  Result,
  StockStatus,
} from './types';

const CATEGORIES: readonly ItemCategory[] = ['电子', '家具', '服装', '工具', '其他'];
const STOCK_STATUSES: readonly StockStatus[] = ['有货', '库存低', '无货'];
const POPULAR_FLAGS: readonly PopularFlag[] = ['是', '否'];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCategory(value: unknown): value is ItemCategory {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

function isStockStatus(value: unknown): value is StockStatus {
  return typeof value === 'string' && (STOCK_STATUSES as readonly string[]).includes(value);
}

function isPopularFlag(value: unknown): value is PopularFlag {
  return typeof value === 'string' && (POPULAR_FLAGS as readonly string[]).includes(value);
}

/**
 * 校验新建物品完整性与取值范围
 */
export function validateNewItem(input: NewItemInput): Result<InventoryItem> {
  if (!isNonEmptyString(input.id)) {
    return { ok: false, message: '物品 ID 不能为空' };
  }
  if (!isNonEmptyString(input.name)) {
    return { ok: false, message: '物品名称不能为空' };
  }
  if (!isCategory(input.category)) {
    return { ok: false, message: '分类必须从：电子、家具、服装、工具、其他 中选择' };
  }
  if (typeof input.quantity !== 'number' || !Number.isFinite(input.quantity) || input.quantity < 0) {
    return { ok: false, message: '数量必须为非负有限数字' };
  }
  if (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price < 0) {
    return { ok: false, message: '价格必须为非负有限数字' };
  }
  if (!isNonEmptyString(input.supplierName)) {
    return { ok: false, message: '供应商名称不能为空' };
  }
  if (!isStockStatus(input.stockStatus)) {
    return { ok: false, message: '库存状态必须从：有货、库存低、无货 中选择' };
  }
  if (!isPopularFlag(input.popular)) {
    return { ok: false, message: '是否热门必须为「是」或「否」' };
  }
  const notes = input.notes;
  if (notes !== undefined && notes !== '' && typeof notes !== 'string') {
    return { ok: false, message: '备注格式无效' };
  }

  const item: InventoryItem = {
    id: input.id.trim(),
    name: input.name.trim(),
    category: input.category,
    quantity: input.quantity,
    price: input.price,
    supplierName: input.supplierName.trim(),
    stockStatus: input.stockStatus,
    popular: input.popular,
    notes: notes?.trim() ? notes.trim() : undefined,
  };
  return { ok: true, data: item };
}

/**
 * 校验按名称更新时的部分字段
 */
export function validatePatch(patch: ItemUpdatePatch): Result<ItemUpdatePatch> {
  const out: ItemUpdatePatch = {};

  if (patch.name !== undefined) {
    if (!isNonEmptyString(patch.name)) {
      return { ok: false, message: '物品名称不能为空' };
    }
    out.name = patch.name.trim();
  }
  if (patch.category !== undefined) {
    if (!isCategory(patch.category)) {
      return { ok: false, message: '分类无效' };
    }
    out.category = patch.category;
  }
  if (patch.quantity !== undefined) {
    if (typeof patch.quantity !== 'number' || !Number.isFinite(patch.quantity) || patch.quantity < 0) {
      return { ok: false, message: '数量必须为非负有限数字' };
    }
    out.quantity = patch.quantity;
  }
  if (patch.price !== undefined) {
    if (typeof patch.price !== 'number' || !Number.isFinite(patch.price) || patch.price < 0) {
      return { ok: false, message: '价格必须为非负有限数字' };
    }
    out.price = patch.price;
  }
  if (patch.supplierName !== undefined) {
    if (!isNonEmptyString(patch.supplierName)) {
      return { ok: false, message: '供应商名称不能为空' };
    }
    out.supplierName = patch.supplierName.trim();
  }
  if (patch.stockStatus !== undefined) {
    if (!isStockStatus(patch.stockStatus)) {
      return { ok: false, message: '库存状态无效' };
    }
    out.stockStatus = patch.stockStatus;
  }
  if (patch.popular !== undefined) {
    if (!isPopularFlag(patch.popular)) {
      return { ok: false, message: '是否热门无效' };
    }
    out.popular = patch.popular;
  }
  if (patch.notes !== undefined) {
    if (typeof patch.notes !== 'string') {
      return { ok: false, message: '备注格式无效' };
    }
    out.notes = patch.notes.trim() ? patch.notes.trim() : undefined;
  }

  if (Object.keys(out).length === 0) {
    return { ok: false, message: '请至少填写一项要更新的内容' };
  }
  return { ok: true, data: out };
}
