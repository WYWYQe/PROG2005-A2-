import type { InventoryItem, ItemUpdatePatch, NewItemInput, Result } from './types';
import { validateNewItem, validatePatch } from './validation';

/**
 * 内存库存仓库：增删改查与按名称索引
 */
export class InventoryStore {
  private items: InventoryItem[] = [];
  /** 已使用过的 ID，保证唯一且录入后不可复用 */
  private readonly usedIds = new Set<string>();

  constructor(seed: readonly InventoryItem[] = []) {
    for (const raw of seed) {
      const v = validateNewItem({ ...raw, id: raw.id });
      if (!v.ok) {
        throw new Error(`种子数据无效: ${v.message}`);
      }
      if (this.usedIds.has(v.data.id)) {
        throw new Error(`种子数据 ID 重复: ${v.data.id}`);
      }
      this.usedIds.add(v.data.id);
      this.items.push({ ...v.data });
    }
  }

  /**
   * 返回当前全部物品的浅拷贝列表
   */
  getAllItems(): InventoryItem[] {
    return this.items.map((i) => ({ ...i }));
  }

  /**
   * 按物品名称精确查找（区分首尾空格已 trim 后的名称）
   */
  findByName(name: string): InventoryItem | undefined {
    const key = name.trim();
    return this.items.find((i) => i.name === key);
  }

  /**
   * 按名称子串搜索（不区分大小写）
   */
  searchByName(query: string): InventoryItem[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.getAllItems();
    }
    return this.items.filter((i) => i.name.toLowerCase().includes(q)).map((i) => ({ ...i }));
  }

  /**
   * 仅热门物品
   */
  getPopularItems(): InventoryItem[] {
    return this.items.filter((i) => i.popular === '是').map((i) => ({ ...i }));
  }

  /**
   * 添加物品：ID 必须全局唯一且仅用一次
   */
  addItem(input: NewItemInput): Result<InventoryItem> {
    const validated = validateNewItem(input);
    if (!validated.ok) {
      return validated;
    }
    const item = validated.data;
    if (this.usedIds.has(item.id)) {
      return { ok: false, message: '该物品 ID 已存在，每个 ID 仅可录入一次' };
    }
    if (this.findByName(item.name)) {
      return { ok: false, message: '已存在同名物品，请使用不同名称或先更新/删除原记录' };
    }
    this.usedIds.add(item.id);
    this.items.push({ ...item });
    return { ok: true, data: { ...item } };
  }

  /**
   * 按当前物品名称更新信息（不可修改 id）
   */
  updateItemByName(currentName: string, patch: ItemUpdatePatch): Result<InventoryItem> {
    const idx = this.items.findIndex((i) => i.name === currentName.trim());
    if (idx === -1) {
      return { ok: false, message: '未找到该名称的物品' };
    }
    const patchResult = validatePatch(patch);
    if (!patchResult.ok) {
      return patchResult;
    }
    const p = patchResult.data;
    const nextName = p.name ?? this.items[idx].name;
    if (p.name !== undefined) {
      const conflict = this.items.find((i, j) => j !== idx && i.name === nextName);
      if (conflict) {
        return { ok: false, message: '更新后的名称与其他物品重复' };
      }
    }
    const current = this.items[idx];
    const updated: InventoryItem = {
      ...current,
      ...p,
      id: current.id,
    };
    const fullCheck = validateNewItem({
      id: updated.id,
      name: updated.name,
      category: updated.category,
      quantity: updated.quantity,
      price: updated.price,
      supplierName: updated.supplierName,
      stockStatus: updated.stockStatus,
      popular: updated.popular,
      notes: updated.notes,
    });
    if (!fullCheck.ok) {
      return fullCheck;
    }
    this.items[idx] = fullCheck.data;
    return { ok: true, data: { ...fullCheck.data } };
  }

  /**
   * 按物品名称删除
   */
  deleteByName(name: string): Result<InventoryItem> {
    const key = name.trim();
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) {
      return { ok: false, message: '未找到该名称的物品' };
    }
    const [removed] = this.items.splice(idx, 1);
    return { ok: true, data: { ...removed } };
  }
}
