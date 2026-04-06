import { InventoryStore } from './inventory';
import type { InventoryItem, ItemCategory, PopularFlag, StockStatus, ViewMode } from './types';

/** 根容器 id */
const ROOT_ID = 'app';

/** 哈维诺曼风格示例硬编码数据 */
const SEED_ITEMS: readonly InventoryItem[] = [
  {
    id: 'HVN-001',
    name: '55寸 4K 智能电视',
    category: '电子',
    quantity: 12,
    price: 899.0,
    supplierName: '三星电子澳洲',
    stockStatus: '有货',
    popular: '是',
    notes: '展厅主推款',
  },
  {
    id: 'HVN-002',
    name: '三人布艺沙发',
    category: '家具',
    quantity: 3,
    price: 1299.0,
    supplierName: '本地家具批发',
    stockStatus: '库存低',
    popular: '否',
  },
  {
    id: 'HVN-003',
    name: '纯棉休闲T恤',
    category: '服装',
    quantity: 0,
    price: 29.9,
    supplierName: '服饰直供',
    stockStatus: '无货',
    popular: '是',
  },
];

const CATEGORIES: ItemCategory[] = ['电子', '家具', '服装', '工具', '其他'];
const STOCK: StockStatus[] = ['有货', '库存低', '无货'];
const POPULAR: PopularFlag[] = ['是', '否'];

let store: InventoryStore;
let viewMode: ViewMode = 'all';
let searchQuery = '';
/** 非空时表示正在按该名称编辑（更新） */
let editingName: string | null = null;
/** 删除确认中的物品名称 */
let pendingDeleteName: string | null = null;

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}

function showMessage(text: string, kind: 'ok' | 'err'): void {
  const el = document.getElementById('toast');
  if (!el) return;
  el.className = `toast toast--${kind}`;
  el.textContent = text;
  el.hidden = false;
  window.clearTimeout((showMessage as unknown as { _t?: number })._t);
  (showMessage as unknown as { _t?: number })._t = window.setTimeout(() => {
    el.hidden = true;
  }, 3800);
}

function getDisplayedItems(): InventoryItem[] {
  if (viewMode === 'popular') {
    return store.getPopularItems();
  }
  if (viewMode === 'search') {
    return store.searchByName(searchQuery);
  }
  return store.getAllItems();
}

function renderTableRows(items: InventoryItem[]): string {
  if (items.length === 0) {
    return `<tr><td colspan="10" class="empty">暂无数据</td></tr>`;
  }
  return items
    .map(
      (it) => `
    <tr>
      <td>${escapeHtml(it.id)}</td>
      <td>${escapeHtml(it.name)}</td>
      <td>${escapeHtml(it.category)}</td>
      <td>${it.quantity}</td>
      <td>${it.price.toFixed(2)}</td>
      <td>${escapeHtml(it.supplierName)}</td>
      <td>${escapeHtml(it.stockStatus)}</td>
      <td>${escapeHtml(it.popular)}</td>
      <td>${it.notes ? escapeHtml(it.notes) : '—'}</td>
      <td class="row-actions">
        <button type="button" class="btn btn--small" data-action="edit" data-name="${escapeHtml(it.name)}">编辑</button>
        <button type="button" class="btn btn--small btn--danger" data-action="del" data-name="${escapeHtml(it.name)}">删除</button>
      </td>
    </tr>`
    )
    .join('');
}

function renderForm(): string {
  const isEdit = editingName !== null;
  const item = isEdit ? store.findByName(editingName!) : undefined;
  const idDisabled = isEdit;
  const idVal = item?.id ?? '';
  const nameVal = item?.name ?? '';
  const cat = item?.category ?? '电子';
  const qty = item?.quantity ?? 0;
  const price = item?.price ?? 0;
  const sup = item?.supplierName ?? '';
  const st = item?.stockStatus ?? '有货';
  const pop = item?.popular ?? '否';
  const notes = item?.notes ?? '';

  const catOpts = CATEGORIES.map(
    (c) => `<option value="${escapeHtml(c)}" ${c === cat ? 'selected' : ''}>${escapeHtml(c)}</option>`
  ).join('');
  const stOpts = STOCK.map(
    (s) => `<option value="${escapeHtml(s)}" ${s === st ? 'selected' : ''}>${escapeHtml(s)}</option>`
  ).join('');
  const popOpts = POPULAR.map(
    (p) => `<option value="${escapeHtml(p)}" ${p === pop ? 'selected' : ''}>${escapeHtml(p)}</option>`
  ).join('');

  return `
  <section class="card" aria-labelledby="form-title">
    <h2 id="form-title">${isEdit ? '编辑物品（按名称更新）' : '添加物品'}</h2>
    <p class="hint">${isEdit ? `正在编辑：<strong>${escapeHtml(editingName!)}</strong> · 物品 ID 不可修改` : '物品 ID 唯一，保存后不可更改'}</p>
    <div class="form-grid">
      <label>物品 ID <input type="text" id="field-id" ${idDisabled ? 'disabled' : ''} value="${escapeHtml(idVal)}" /></label>
      <label>物品名称 <input type="text" id="field-name" value="${escapeHtml(nameVal)}" /></label>
      <label>分类 <select id="field-category">${catOpts}</select></label>
      <label>数量 <input type="number" id="field-qty" min="0" step="1" value="${qty}" /></label>
      <label>价格 <input type="number" id="field-price" min="0" step="0.01" value="${price}" /></label>
      <label>供应商 <input type="text" id="field-supplier" value="${escapeHtml(sup)}" /></label>
      <label>库存状态 <select id="field-stock">${stOpts}</select></label>
      <label>是否热门 <select id="field-popular">${popOpts}</select></label>
      <label class="span-2">备注（选填） <input type="text" id="field-notes" value="${escapeHtml(notes)}" placeholder="可留空" /></label>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn--primary" id="btn-save">${isEdit ? '更新保存' : '添加保存'}</button>
      ${isEdit ? '<button type="button" class="btn" id="btn-cancel-edit">取消编辑</button>' : ''}
    </div>
  </section>`;
}

function renderModal(): string {
  if (!pendingDeleteName) return '';
  return `
  <div class="modal-backdrop" id="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal">
      <h3 id="modal-title">确认删除</h3>
      <p>确定要删除物品「<strong>${escapeHtml(pendingDeleteName)}</strong>」吗？此操作不可撤销（刷新页面后数据不保留）。</p>
      <div class="modal-actions">
        <button type="button" class="btn" id="btn-modal-cancel">取消</button>
        <button type="button" class="btn btn--danger" id="btn-modal-confirm">确认删除</button>
      </div>
    </div>
  </div>`;
}

function render(): void {
  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  const items = getDisplayedItems();
  const modeLabel =
    viewMode === 'all' ? '全部物品' : viewMode === 'popular' ? '热门物品' : `搜索结果：「${escapeHtml(searchQuery)}」`;

  root.innerHTML = `
    <header class="page-header">
      <h1>库存管理系统</h1>
      <p class="subtitle">哈维诺曼式示例数据库 · 浏览器内存运行，关闭后数据不保存</p>
    </header>
    <div id="toast" class="toast" hidden></div>
    ${renderForm()}
    <section class="card">
      <h2>浏览与筛选</h2>
      <div class="toolbar">
        <label class="grow">按名称搜索 <input type="search" id="search-input" placeholder="输入名称关键字" value="${escapeHtml(searchQuery)}" /></label>
        <button type="button" class="btn" id="btn-search">搜索</button>
        <button type="button" class="btn" id="btn-show-all">显示全部</button>
        <button type="button" class="btn btn--accent" id="btn-show-popular">仅热门</button>
      </div>
      <p class="toolbar-meta">当前视图：<strong>${modeLabel}</strong> · 共 ${items.length} 条</p>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>名称</th><th>分类</th><th>数量</th><th>价格</th>
              <th>供应商</th><th>状态</th><th>热门</th><th>备注</th><th>操作</th>
            </tr>
          </thead>
          <tbody id="tbody-main">
            ${renderTableRows(items)}
          </tbody>
        </table>
      </div>
    </section>
    <footer class="page-footer">TypeScript 结构化模型 · innerHTML 渲染 · 无 alert</footer>
    ${renderModal()}
  `;

  bindEvents();
}

function readForm(): {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  popular: PopularFlag;
  notes: string;
} {
  const id = (document.getElementById('field-id') as HTMLInputElement)?.value ?? '';
  const name = (document.getElementById('field-name') as HTMLInputElement)?.value ?? '';
  const category = (document.getElementById('field-category') as HTMLSelectElement)?.value as ItemCategory;
  const qty = Number((document.getElementById('field-qty') as HTMLInputElement)?.value);
  const price = Number((document.getElementById('field-price') as HTMLInputElement)?.value);
  const supplierName = (document.getElementById('field-supplier') as HTMLInputElement)?.value ?? '';
  const stockStatus = (document.getElementById('field-stock') as HTMLSelectElement)?.value as StockStatus;
  const popular = (document.getElementById('field-popular') as HTMLSelectElement)?.value as PopularFlag;
  const notesRaw = (document.getElementById('field-notes') as HTMLInputElement)?.value ?? '';
  return {
    id: id.trim(),
    name: name.trim(),
    category,
    quantity: qty,
    price,
    supplierName: supplierName.trim(),
    stockStatus,
    popular,
    notes: notesRaw.trim(),
  };
}

function bindEvents(): void {
  document.getElementById('btn-save')?.addEventListener('click', onSave);
  document.getElementById('btn-cancel-edit')?.addEventListener('click', () => {
    editingName = null;
    render();
    showMessage('已取消编辑', 'ok');
  });

  document.getElementById('btn-search')?.addEventListener('click', () => {
    searchQuery = (document.getElementById('search-input') as HTMLInputElement)?.value ?? '';
    viewMode = 'search';
    render();
  });
  document.getElementById('search-input')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      searchQuery = (document.getElementById('search-input') as HTMLInputElement)?.value ?? '';
      viewMode = 'search';
      render();
    }
  });

  document.getElementById('btn-show-all')?.addEventListener('click', () => {
    viewMode = 'all';
    render();
  });
  document.getElementById('btn-show-popular')?.addEventListener('click', () => {
    viewMode = 'popular';
    render();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      if (name) {
        editingName = name;
        render();
        showMessage('已进入编辑模式，修改后点击「更新保存」', 'ok');
      }
    });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-action="del"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      if (name) {
        pendingDeleteName = name;
        render();
      }
    });
  });

  document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
    pendingDeleteName = null;
    render();
  });
  document.getElementById('btn-modal-confirm')?.addEventListener('click', () => {
    if (!pendingDeleteName) return;
    const r = store.deleteByName(pendingDeleteName);
    pendingDeleteName = null;
    if (r.ok) {
      if (editingName === r.data.name) editingName = null;
      showMessage(`已删除：${r.data.name}`, 'ok');
    } else {
      showMessage(r.message, 'err');
    }
    render();
  });
  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'modal-backdrop') {
      pendingDeleteName = null;
      render();
    }
  });
}

function onSave(): void {
  const f = readForm();
  if (editingName) {
    const patch = {
      name: f.name,
      category: f.category,
      quantity: f.quantity,
      price: f.price,
      supplierName: f.supplierName,
      stockStatus: f.stockStatus,
      popular: f.popular,
      notes: f.notes || undefined,
    };
    const r = store.updateItemByName(editingName, patch);
    if (r.ok) {
      editingName = null;
      showMessage('已按名称更新物品信息', 'ok');
      render();
    } else {
      showMessage(r.message, 'err');
    }
  } else {
    const r = store.addItem({
      id: f.id,
      name: f.name,
      category: f.category,
      quantity: f.quantity,
      price: f.price,
      supplierName: f.supplierName,
      stockStatus: f.stockStatus,
      popular: f.popular,
      notes: f.notes || undefined,
    });
    if (r.ok) {
      showMessage('已添加物品', 'ok');
      render();
    } else {
      showMessage(r.message, 'err');
    }
  }
}

function init(): void {
  store = new InventoryStore(SEED_ITEMS);
  render();
}

init();
