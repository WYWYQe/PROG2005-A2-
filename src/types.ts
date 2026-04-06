/**
 * 库存管理系统 — 领域类型与操作结果类型
 */

/** 物品分类 */
export type ItemCategory = '电子' | '家具' | '服装' | '工具' | '其他';

/** 库存状态 */
export type StockStatus = '有货' | '库存低' | '无货';

/** 是否热门 */
export type PopularFlag = '是' | '否';

/**
 * 库存物品（除备注外均为必填）
 */
export interface InventoryItem {
  /** 唯一标识，录入后不可修改 */
  readonly id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  popular: PopularFlag;
  /** 非必填 */
  notes?: string;
}

/** 新建物品时的输入（不含 id，由系统生成或由用户填写但仅首次有效） */
export type NewItemInput = Omit<InventoryItem, 'id'> & { id: string };

/** 按名称更新时可修改的字段（不允许改 id） */
export type ItemUpdatePatch = Partial<
  Pick<
    InventoryItem,
    | 'name'
    | 'category'
    | 'quantity'
    | 'price'
    | 'supplierName'
    | 'stockStatus'
    | 'popular'
    | 'notes'
  >
>;

/** 操作成功 */
export type OkResult<T> = { ok: true; data: T };

/** 操作失败（带可读原因） */
export type ErrResult = { ok: false; message: string };

/** 统一结果类型 */
export type Result<T> = OkResult<T> | ErrResult;

/** 列表视图模式 */
export type ViewMode = 'all' | 'popular' | 'search';
