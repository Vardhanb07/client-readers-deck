const API_BASE = "https://readers-deck.vardhanbattula7.workers.dev";
const STORAGE_KEY = "readersDeckHeaderConfig";

const bodyEl = document.body;
const headerEl = document.querySelector("header");
const mainEl = document.querySelector("main");
const headerModal = document.getElementById("header-modal");
const headerForm = document.getElementById("header-form");
const toastEl = document.getElementById("toast");
const categoryListEl = document.getElementById("category-list");
const emptyStateEl = document.getElementById("empty-state");
const addCategoryForm = document.getElementById("add-category");
const addItemForm = document.getElementById("add-item");
const categorySelect = document.getElementById("category-select");
const refreshBtn = document.getElementById("refresh");

const loadHeaderConfig = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.key && parsed.value) {
      return parsed;
    }
  } catch (error) {
    return null;
  }
  return null;
};

let headerConfig = loadHeaderConfig();
let categoriesCache = [];

const showToast = (message, isError = false) => {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.style.background = isError ? "#8f2f1b" : "#1b1611";
  setTimeout(() => toastEl.classList.add("hidden"), 2600);
};

const openHeaderModal = () => {
  headerModal.classList.remove("hidden");
  bodyEl.classList.add("gate-active");
  headerEl?.setAttribute("inert", "");
  mainEl?.setAttribute("inert", "");
};

const closeHeaderModal = () => {
  headerModal.classList.add("hidden");
  bodyEl.classList.remove("gate-active");
  headerEl?.removeAttribute("inert");
  mainEl?.removeAttribute("inert");
};

const apiFetch = async (path, options = {}) => {
  if (!headerConfig) {
    throw new Error("Header key/value not set");
  }
  const headers = {
    "Content-Type": "application/json",
    [headerConfig.key]: headerConfig.value,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const groupByCategory = (data) => {
  const map = new Map();
  data.forEach((entry) => {
    const category = entry.categories;
    const item = entry.items;

    if (!map.has(category.id)) {
      map.set(category.id, { ...category, items: [] });
    }

    if (item && item.id) {
      map.get(category.id).items.push(item);
    }
  });

  return Array.from(map.values());
};

const renderCategorySelect = () => {
  if (!categorySelect) {
    return;
  }
  categorySelect.innerHTML = "";
  categoriesCache.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
};

const renderCategories = () => {
  if (!categoryListEl || !emptyStateEl) {
    return;
  }
  categoryListEl.innerHTML = "";

  if (!categoriesCache.length) {
    emptyStateEl.classList.remove("hidden");
    return;
  }

  emptyStateEl.classList.add("hidden");

  categoriesCache.forEach((category, index) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.style.animationDelay = `${Math.min(index * 0.05, 0.3)}s`;

    const header = document.createElement("div");
    header.className = "category-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "category-line";

    const title = document.createElement("div");
    title.className = "category-title";
    title.textContent = category.name;

    titleWrap.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const renameBtn = document.createElement("button");
    renameBtn.className = "icon-btn";
    renameBtn.type = "button";
    renameBtn.setAttribute("aria-label", "Edit category");
    renameBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    `;
    renameBtn.addEventListener("click", () => toggleCategoryRename(card));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn";
    deleteBtn.type = "button";
    deleteBtn.setAttribute("aria-label", "Delete category");
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    `;
    deleteBtn.addEventListener("click", () => deleteCategory(category.id));

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    titleWrap.appendChild(actions);

    header.appendChild(titleWrap);

    const renameForm = document.createElement("form");
    renameForm.className = "inline-form";
    renameForm.innerHTML = `
      <input type="text" name="name" value="${category.name}" required />
      <button type="submit">Save</button>
      <button type="button" class="ghost" data-cancel>Cancel</button>
    `;
    renameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = new FormData(renameForm).get("name");
      updateCategory(category.id, name);
    });
    renameForm
      .querySelector("[data-cancel]")
      .addEventListener("click", () => toggleCategoryRename(card, false));

    const itemList = document.createElement("div");
    itemList.className = "item-list";

    category.items.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "item";

      const itemRow = document.createElement("div");
      itemRow.className = "item-row";

      const itemLine = document.createElement("div");
      itemLine.className = "item-line";

      const itemTitle = document.createElement("div");
      itemTitle.className = "item-title";
      itemTitle.textContent = item.name;

      const itemMeta = document.createElement("div");
      itemMeta.className = "item-meta";
      itemMeta.textContent = `pages ${item.pages} | current ${item.currentPage}`;

      itemLine.appendChild(itemTitle);
      itemLine.appendChild(itemMeta);

      const itemActions = document.createElement("div");
      itemActions.className = "item-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.type = "button";
      editBtn.setAttribute("aria-label", "Edit item");
      editBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      `;
      editBtn.addEventListener("click", () => toggleItemEdit(itemEl));

      const removeBtn = document.createElement("button");
      removeBtn.className = "icon-btn";
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Delete item");
      removeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      `;
      removeBtn.addEventListener("click", () => deleteItem(item.id));

      itemActions.appendChild(editBtn);
      itemActions.appendChild(removeBtn);

      itemRow.appendChild(itemLine);
      itemRow.appendChild(itemActions);

      const itemForm = document.createElement("form");
      itemForm.className = "inline-form";
      itemForm.innerHTML = `
        <input type="text" name="name" value="${item.name}" required />
        <input type="number" name="pages" min="1" value="${item.pages}" required />
        <input type="number" name="currentPage" min="0" value="${item.currentPage}" required />
        <button type="submit">Save</button>
        <button type="button" class="ghost" data-cancel>Cancel</button>
      `;
      itemForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(itemForm);
        updateItem(item.id, {
          name: formData.get("name"),
          pages: Number(formData.get("pages")),
          currentPage: Number(formData.get("currentPage")),
          categoryId: category.id,
        });
      });
      itemForm
        .querySelector("[data-cancel]")
        .addEventListener("click", () => toggleItemEdit(itemEl, false));

      itemEl.appendChild(itemRow);
      itemEl.appendChild(itemMeta);
      itemEl.appendChild(itemForm);
      itemList.appendChild(itemEl);
    });

    card.appendChild(header);
    card.appendChild(renameForm);
    card.appendChild(itemList);

    categoryListEl.appendChild(card);
  });
};

const toggleCategoryRename = (card, force) => {
  const form = card.querySelector(".inline-form");
  const shouldShow = force ?? !form.classList.contains("active");
  form.classList.toggle("active", shouldShow);
};

const toggleItemEdit = (itemEl, force) => {
  const form = itemEl.querySelector(".inline-form");
  const shouldShow = force ?? !form.classList.contains("active");
  form.classList.toggle("active", shouldShow);
};

const loadData = async () => {
  try {
    const data = await apiFetch("/api/v1/");
    categoriesCache = groupByCategory(data || []);
    renderCategorySelect();
    renderCategories();
  } catch (error) {
    showToast(error.message || "Failed to load data", true);
  }
};

const createCategory = async (name) => {
  try {
    await apiFetch("/api/v1/category", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    showToast("Category created");
    await loadData();
  } catch (error) {
    showToast(error.message || "Failed to create category", true);
  }
};

const updateCategory = async (id, name) => {
  try {
    await apiFetch(`/api/v1/category/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    showToast("Category updated");
    await loadData();
  } catch (error) {
    showToast(error.message || "Failed to update category", true);
  }
};

const deleteCategory = async (id) => {
  try {
    await apiFetch(`/api/v1/category/${id}`, { method: "DELETE" });
    showToast("Category deleted");
    await loadData();
  } catch (error) {
    showToast(error.message || "Failed to delete category", true);
  }
};

const createItem = async (payload) => {
  try {
    await apiFetch("/api/v1/item", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    showToast("Item added");
    await loadData();
  } catch (error) {
    showToast(error.message || "Failed to add item", true);
  }
};

const updateItem = async (id, payload) => {
  try {
    await apiFetch(`/api/v1/item/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    showToast("Item updated");
    await loadData();
  } catch (error) {
    showToast(error.message || "Failed to update item", true);
  }
};

const deleteItem = async (id) => {
  try {
    await apiFetch(`/api/v1/item/${id}`, { method: "DELETE" });
    showToast("Item deleted");
    await loadData();
  } catch (error) {
    showToast(error.message || "Failed to delete item", true);
  }
};

headerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(headerForm);
  const headerKey = String(formData.get("headerKey") || "").trim();
  const headerValue = String(formData.get("headerValue") || "").trim();
  if (!headerKey || !headerValue) {
    showToast("Header key and value are required", true);
    return;
  }
  headerConfig = { key: headerKey, value: headerValue };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(headerConfig));
  } catch (error) {
    showToast("Storage blocked; header saved for this session", true);
  }
  closeHeaderModal();
  headerForm.reset();
  loadData();
});

if (addCategoryForm) {
  addCategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(addCategoryForm).get("name");
    createCategory(name.trim());
    addCategoryForm.reset();
  });
}

if (addItemForm) {
  addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addItemForm);
    createItem({
      name: formData.get("name"),
      categoryId: Number(formData.get("categoryId")),
      pages: Number(formData.get("pages")),
      currentPage: Number(formData.get("currentPage")),
    });
    addItemForm.reset();
  });
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", loadData);
}

if (!headerConfig) {
  openHeaderModal();
} else {
  closeHeaderModal();
  loadData();
}
