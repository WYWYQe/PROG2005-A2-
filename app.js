"use strict";
// Root element ID
const ROOT_ID = 'app';
// Dropdown options
const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Other'];
const STOCK = ['In Stock', 'Low Stock', 'Out of Stock'];
const POPULAR = ['Yes', 'No'];
// Seed inventory data
let inventoryList = [
    { id: '1', name: 'TV', category: 'Electronics', quantity: 12, price: 899, supplierName: 'Electronics Supplier', stockStatus: 'In Stock', popular: 'Yes', notes: 'Top showroom item' },
    { id: '2', name: 'Sofa', category: 'Furniture', quantity: 3, price: 1299, supplierName: 'Furniture Wholesale', stockStatus: 'Low Stock', popular: 'No' },
    { id: '3', name: 'T-shirt', category: 'Clothing', quantity: 0, price: 9.9, supplierName: 'Clothing Direct', stockStatus: 'Out of Stock', popular: 'Yes' },
];
// Track used IDs for quick duplicate checks
const usedIds = new Set(inventoryList.map((i) => i.id));
// Page state
let viewMode = 'all'; // current view mode
let searchQuery = ''; // current search keyword
let editingName = null; // current editing item name
let pendingDeleteName = null; // item name pending deletion
// Toast message
function showMessage(text, kind) {
    const el = document.getElementById('toast');
    if (!el)
        return;
    el.className = `toast toast--${kind}`;
    el.textContent = text;
    el.hidden = false;
    // Clear previous timer before showing a new toast
    window.clearTimeout(showMessage._t);
    showMessage._t = window.setTimeout(() => {
        el.hidden = true;
    }, 3000);
}
// Find item by name (edit/delete/update)
function findByName(name) {
    return inventoryList.find((i) => i.name === name.trim());
}
// Return items to display by view mode
function getDisplayedItems() {
    // Show popular items only
    if (viewMode === 'popular')
        return inventoryList.filter((i) => i.popular === 'Yes');
    if (viewMode === 'search') {
        const q = searchQuery.trim().toLowerCase();
        return q ? inventoryList.filter((i) => i.name.toLowerCase().includes(q)) : inventoryList;
    }
    // Default: show all
    return inventoryList;
}
// Render table rows
function renderTableRows(items) {
    if (items.length === 0)
        return `<tr><td colspan="10" class="empty">No data</td></tr>`;
    return items
        .map((it) => `
    <tr>
      <td>${it.id}</td>
      <td>${it.name}</td>
      <td>${it.category}</td>
      <td>${it.quantity}</td>
      <td>${it.price.toFixed(2)}</td>
      <td>${it.supplierName}</td>
      <td>${it.stockStatus}</td>
      <td>${it.popular}</td>
      <td>${it.notes ?? '-'}</td>
      <td class="row-actions">
        <button type="button" class="btn btn--small" data-action="edit" data-name="${it.name}">Edit</button>
        <button type="button" class="btn btn--small btn--danger" data-action="del" data-name="${it.name}">Delete</button>
      </td>
    </tr>`)
        .join('');
}
// Render add/edit form
function renderForm() {
    const isEdit = editingName !== null;
    const item = isEdit ? findByName(editingName) : undefined;
    // Use existing item values in edit mode
    const idVal = item?.id ?? '';
    const nameVal = item?.name ?? '';
    const cat = item?.category ?? 'Electronics';
    const qty = item?.quantity ?? 0;
    const price = item?.price ?? 0;
    const sup = item?.supplierName ?? '';
    const st = item?.stockStatus ?? 'In Stock';
    const pop = item?.popular ?? 'No';
    const notes = item?.notes ?? '';
    // Build select options
    const catOpts = CATEGORIES.map((c) => `<option value="${c}" ${c === cat ? 'selected' : ''}>${c}</option>`).join('');
    const stOpts = STOCK.map((s) => `<option value="${s}" ${s === st ? 'selected' : ''}>${s}</option>`).join('');
    const popOpts = POPULAR.map((p) => `<option value="${p}" ${p === pop ? 'selected' : ''}>${p}</option>`).join('');
    return `
  <section class="card" aria-labelledby="form-title">
    <h2 id="form-title">${isEdit ? 'Edit item (update by name)' : 'Add item'}</h2>
    <p class="hint">${isEdit ? `Editing: <strong>${editingName}</strong>` : 'Fill in fields then click Save'}</p>
    <div class="form-grid">
      <label>Item ID <input type="text" id="field-id" value="${idVal}" /></label>
      <label>Item Name <input type="text" id="field-name" value="${nameVal}" /></label>
      <label>Category <select id="field-category">${catOpts}</select></label>
      <label>Quantity <input type="number" id="field-qty" min="0" step="1" value="${qty}" /></label>
      <label>Price <input type="number" id="field-price" min="0" step="0.01" value="${price}" /></label>
      <label>Supplier <input type="text" id="field-supplier" value="${sup}" /></label>
      <label>Stock Status <select id="field-stock">${stOpts}</select></label>
      <label>Popular <select id="field-popular">${popOpts}</select></label>
      <label class="span-2">Notes (optional) <input type="text" id="field-notes" value="${notes}" /></label>
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn--primary" id="btn-save">${isEdit ? 'Update' : 'Add'}</button>
      ${isEdit ? '<button type="button" class="btn" id="btn-cancel-edit">Cancel edit</button>' : ''}
    </div>
  </section>`;
}
// Render delete confirmation modal
function renderModal() {
    if (!pendingDeleteName)
        return '';
    return `
  <div class="modal-backdrop" id="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal">
      <h3 id="modal-title">Confirm deletion</h3>
      <p>Are you sure you want to delete "<strong>${pendingDeleteName}</strong>"?</p>
      <div class="modal-actions">
        <button type="button" class="btn" id="btn-modal-cancel">Cancel</button>
        <button type="button" class="btn btn--danger" id="btn-modal-confirm">Delete</button>
      </div>
    </div>
  </div>`;
}
// Main render function
function render() {
    const root = document.getElementById(ROOT_ID);
    if (!root)
        return;
    const items = getDisplayedItems();
    // Current filter label
    const modeLabel = viewMode === 'all'
        ? 'All items'
        : viewMode === 'popular'
            ? 'Popular items'
            : searchQuery.trim()
                ? `Search results: "${searchQuery}"`
                : 'Empty search';
    // Re-render page via innerHTML
    root.innerHTML = `
    <header class="page-header"><h1>Inventory Management System</h1></header>
    <div id="toast" class="toast" hidden></div>
    ${renderForm()}
    <section class="card">
      <h2>Browse and Filter</h2>
      <div class="toolbar">
        <label class="grow">Search by name <input type="search" id="search-input" placeholder="Enter name keyword" value="${searchQuery}" /></label>
        <button type="button" class="btn" id="btn-search">Search</button>
        <button type="button" class="btn" id="btn-show-all">Show all</button>
        <button type="button" class="btn btn--accent" id="btn-show-popular">Popular only</button>
      </div>
      <p class="toolbar-meta">Current view: <strong>${modeLabel}</strong> · ${items.length} items</p>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Quantity</th><th>Price</th><th>Supplier</th><th>Status</th><th>Popular</th><th>Notes</th><th>Actions</th></tr></thead>
          <tbody id="tbody-main">${renderTableRows(items)}</tbody>
        </table>
      </div>
    </section>
    ${renderModal()}
  `;
    // Re-bind events after each render
    bindEvents();
}
// Read form values
function readForm() {
    return {
        id: (document.getElementById('field-id')?.value ?? '').trim(),
        name: (document.getElementById('field-name')?.value ?? '').trim(),
        category: document.getElementById('field-category')?.value,
        quantity: Number(document.getElementById('field-qty')?.value),
        price: Number(document.getElementById('field-price')?.value),
        supplierName: (document.getElementById('field-supplier')?.value ?? '').trim(),
        stockStatus: document.getElementById('field-stock')?.value,
        popular: document.getElementById('field-popular')?.value,
        notes: (document.getElementById('field-notes')?.value ?? '').trim(),
    };
}
// Form validation
function validateForm(f) {
    if (!f.id)
        return showMessage('Item ID is required', 'err'), false;
    if (!f.name)
        return showMessage('Item name is required', 'err'), false;
    if (!CATEGORIES.includes(f.category))
        return showMessage('Invalid category', 'err'), false;
    if (!Number.isFinite(f.quantity) || f.quantity < 0)
        return showMessage('Quantity must be a non-negative number', 'err'), false;
    if (!Number.isFinite(f.price) || f.price < 0)
        return showMessage('Price must be a non-negative number', 'err'), false;
    if (!f.supplierName)
        return showMessage('Supplier is required', 'err'), false;
    if (!STOCK.includes(f.stockStatus))
        return showMessage('Invalid stock status', 'err'), false;
    if (!POPULAR.includes(f.popular))
        return showMessage('Invalid popular value', 'err'), false;
    return true;
}
// Bind page events
function bindEvents() {
    // Save (add/update)
    document.getElementById('btn-save')?.addEventListener('click', onSave);
    // Cancel edit
    document.getElementById('btn-cancel-edit')?.addEventListener('click', () => {
        editingName = null;
        render();
    });
    // Click search button
    document.getElementById('btn-search')?.addEventListener('click', () => {
        searchQuery = document.getElementById('search-input')?.value ?? '';
        viewMode = 'search';
        render();
    });
    // Press Enter to search
    document.getElementById('search-input')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchQuery = document.getElementById('search-input')?.value ?? '';
            viewMode = 'search';
            render();
        }
    });
    // Show all
    document.getElementById('btn-show-all')?.addEventListener('click', () => {
        viewMode = 'all';
        render();
    });
    // Popular only
    document.getElementById('btn-show-popular')?.addEventListener('click', () => {
        viewMode = 'popular';
        render();
    });
    // Edit button
    document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) {
                editingName = name;
                render();
            }
        });
    });
    // Delete button
    document.querySelectorAll('[data-action="del"]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) {
                pendingDeleteName = name;
                render();
            }
        });
    });
    // Cancel delete
    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
        pendingDeleteName = null;
        render();
    });
    // Confirm delete
    document.getElementById('btn-modal-confirm')?.addEventListener('click', () => {
        if (!pendingDeleteName)
            return;
        const idx = inventoryList.findIndex((i) => i.name === pendingDeleteName);
        if (idx === -1) {
            showMessage('Item not found', 'err');
        }
        else {
            const [removed] = inventoryList.splice(idx, 1);
            // Release ID after deletion, so it can be reused
            usedIds.delete(removed.id);
            // Exit edit mode if deleting the current editing item
            if (editingName === removed.name)
                editingName = null;
            showMessage(`Deleted: ${removed.name}`, 'ok');
        }
        pendingDeleteName = null;
        render();
    });
    // Close modal by clicking backdrop
    document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-backdrop') {
            pendingDeleteName = null;
            render();
        }
    });
}
// Save logic: add or update item
function onSave() {
    const f = readForm();
    // Run validation first
    if (!validateForm(f))
        return;
    // Edit mode: update by item name
    if (editingName) {
        const idx = inventoryList.findIndex((i) => i.name === editingName);
        if (idx === -1)
            return showMessage('Item not found', 'err');
        // Updated name must not conflict with others
        const conflict = inventoryList.find((i, j) => j !== idx && i.name === f.name);
        if (conflict)
            return showMessage('Updated name conflicts with another item', 'err');
        const oldId = inventoryList[idx].id;
        if (f.id !== oldId && usedIds.has(f.id)) {
            return showMessage('Item ID already exists, please use another ID', 'err');
        }
        // Update ID usage record
        if (f.id !== oldId) {
            usedIds.delete(oldId);
            usedIds.add(f.id);
        }
        inventoryList[idx] = {
            id: f.id,
            name: f.name,
            category: f.category,
            quantity: f.quantity,
            price: f.price,
            supplierName: f.supplierName,
            stockStatus: f.stockStatus,
            popular: f.popular,
            notes: f.notes || undefined,
        };
        editingName = null;
        showMessage('Item updated', 'ok');
        render();
        return;
    }
    // Add mode: name must be unique
    if (findByName(f.name))
        return showMessage('Item name already exists, please use another name', 'err');
    // Add mode: ID must be unique
    if (usedIds.has(f.id))
        return showMessage('Item ID already exists, please use another ID', 'err');
    inventoryList.push({
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
    // Record newly used ID
    usedIds.add(f.id);
    showMessage('Item added', 'ok');
    render();
}
// Initialize page
render();
