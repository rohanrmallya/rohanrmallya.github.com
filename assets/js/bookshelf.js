(function () {
  // State management
  let currentBooks = [];
  let filteredBooks = [];
  let allCategories = [];
  let currentPage = 1;
  const ITEMS_PER_PAGE = 20;

  // DOM elements
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categorySelect = document.getElementById("categorySelect");
  const booksGrid = document.getElementById("booksGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");
  const pagination = document.getElementById("pagination");

  // Initialize the application
  function init() {
    currentBooks = window.BOOKS_DATA || [];
    processBookData();
    setupEventListeners();
    loadStateFromURL();
    renderBooks();
  }

  // Process book data and extract categories
  function processBookData() {
    const categorySet = new Set();

    currentBooks.forEach((book) => {
      if (book.category && book.category.trim()) {
        categorySet.add(book.category.trim());
      }
    });

    allCategories = Array.from(categorySet).sort();
    populateCategoryControls();
  }

  // Populate category dropdown
  function populateCategoryControls() {
    // Populate dropdown
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    allCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    searchInput.addEventListener(
      "input",
      debounce(updateFiltersAndRender, 300),
    );
    sortSelect.addEventListener("change", updateFiltersAndRender);
    categorySelect.addEventListener("change", updateFiltersAndRender);
    clearFiltersBtn.addEventListener("click", clearAllFilters);

    // Update URL on filter changes
    [searchInput, sortSelect, categorySelect].forEach((element) => {
      element.addEventListener("change", updateURL);
      element.addEventListener("input", debounce(updateURL, 500));
    });

    // Pagination navigation using event delegation
    if (pagination) {
      pagination.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (button && button.hasAttribute("data-page") && !button.disabled) {
          const page = parseInt(button.getAttribute("data-page"), 10);
          goToPage(page);
        }
      });
    }
  }

  // Filter and sort books
  function filterAndSortBooks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;
    const sortBy = sortSelect.value;

    // Filter books
    filteredBooks = currentBooks.filter((book) => {
      const matchesSearch =
        !searchTerm ||
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);

      const matchesCategory =
        !selectedCategory || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort books
    filteredBooks.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return compareDates(a.date_finished, b.date_finished); // newest first
        case "oldest":
          return compareDates(b.date_finished, a.date_finished); // oldest first
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
  }

  // Compare dates, treating missing dates as oldest
  function compareDates(dateA, dateB) {
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1; // dateA is older (missing date)
    if (!dateB) return -1; // dateB is older (missing date)
    return new Date(dateB) - new Date(dateA);
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  }

  // Render books grid with pagination
  function renderBooks() {
    filterAndSortBooks();

    const count = filteredBooks.length;

    // Show/hide empty state
    if (count === 0) {
      booksGrid.classList.add("hidden");
      if (pagination) {
        pagination.classList.add("hidden");
      }
      emptyState.classList.remove("hidden");
      resultsCount.textContent = "Showing 0 books";
      return;
    }

    booksGrid.classList.remove("hidden");
    if (pagination) {
      pagination.classList.remove("hidden");
    }
    emptyState.classList.add("hidden");

    // Pagination calculations
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, count);
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    // Update results count
    if (count > ITEMS_PER_PAGE) {
      resultsCount.textContent = `Showing ${startIndex + 1}–${endIndex} of ${count} books`;
    } else {
      resultsCount.textContent = `Showing ${count} book${count !== 1 ? "s" : ""}`;
    }

    // Render book cards
    booksGrid.innerHTML = paginatedBooks
      .map(
        (book, idx) => {
          const absoluteIndex = startIndex + idx + 1;
          return `
            <article class="group bg-surface-container-low hover:bg-surface-container p-5 rounded-lg transition-all duration-300 flex flex-col h-full min-h-[140px] relative border border-outline-variant/10">
              <div class="flex items-center justify-between gap-2 mb-2 w-full">
                ${
                  book.category
                    ? `<span class="text-[0.6rem] font-bold uppercase tracking-[0.05em] text-v2-primary px-1.5 py-0.5 bg-v2-primary/10 rounded">${book.category}</span>`
                    : "<span></span>"
                }
                <span class="text-[0.7rem] font-bold text-on-surface-variant/40 select-none font-mono">#${absoluteIndex}</span>
              </div>
              
              ${
                book.link
                  ? `<h3 class="text-[1rem] font-semibold tracking-tight leading-tight mb-1 group-hover:text-v2-primary transition-colors line-clamp-2">
                      <a href="${book.link}" target="_blank" rel="noopener noreferrer" class="focus:outline-none after:absolute after:inset-0">
                        ${book.title}
                      </a>
                    </h3>`
                  : `<h3 class="text-[1rem] font-semibold tracking-tight leading-tight mb-1 group-hover:text-v2-primary transition-colors line-clamp-2">${book.title}</h3>`
              }
              
              <p class="text-on-surface-variant text-xs mb-3">${book.author}</p>
              
              ${
                book.notes_url
                  ? `<div class="mt-auto pt-2">
                      <a href="${book.notes_url}" class="relative z-10 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.05em] text-v2-primary px-1.5 py-0.5 bg-v2-primary/10 rounded border border-v2-primary/20 hover:bg-v2-primary/20 transition-colors w-fit">
                        <span class="material-symbols-outlined text-[14px]">edit_document</span>
                        Notes
                      </a>
                    </div>`
                  : ""
              }
            </article>
          `;
        },
      )
      .join("");

    renderPagination(totalPages);
  }

  // Render pagination controls
  function renderPagination(totalPages) {
    if (!pagination) return;

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      pagination.classList.add("hidden");
      return;
    }

    pagination.classList.remove("hidden");
    let html = "";

    // Previous button
    if (currentPage > 1) {
      html += `
        <button data-page="${currentPage - 1}" class="px-3 py-2 rounded-md bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 text-on-surface text-sm font-medium hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer" aria-label="Previous Page">
          <span class="material-symbols-outlined text-base">chevron_left</span>
          Prev
        </button>
      `;
    } else {
      html += `
        <button class="px-3 py-2 rounded-md bg-surface-container-low/50 border border-outline-variant/5 text-on-surface-variant/40 text-sm font-medium flex items-center gap-1 cursor-not-allowed opacity-50" disabled aria-label="Previous Page">
          <span class="material-symbols-outlined text-base">chevron_left</span>
          Prev
        </button>
      `;
    }

    const range = (start, end) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);
    let pages = [];
    const delta = 1;

    if (totalPages <= 5) {
      pages = range(1, totalPages);
    } else {
      const leftLimit = currentPage - delta;
      const rightLimit = currentPage + delta;

      pages.push(1);

      if (leftLimit > 2) {
        pages.push("...");
      }

      const start = Math.max(2, leftLimit);
      const end = Math.min(totalPages - 1, rightLimit);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (rightLimit < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    pages.forEach((page) => {
      if (page === "...") {
        html += `<span class="w-9 h-9 flex items-center justify-center text-on-surface-variant/60 text-sm font-medium">...</span>`;
      } else if (page === currentPage) {
        html += `
          <button class="w-9 h-9 rounded-md bg-v2-primary text-on-primary font-bold text-sm flex items-center justify-center shadow-md transition-all cursor-default" aria-current="page" disabled>
            ${page}
          </button>
        `;
      } else {
        html += `
          <button data-page="${page}" class="w-9 h-9 rounded-md bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 text-on-surface font-semibold text-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer">
            ${page}
          </button>
        `;
      }
    });

    // Next button
    if (currentPage < totalPages) {
      html += `
        <button data-page="${currentPage + 1}" class="px-3 py-2 rounded-md bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 text-on-surface text-sm font-medium hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer" aria-label="Next Page">
          Next
          <span class="material-symbols-outlined text-base">chevron_right</span>
        </button>
      `;
    } else {
      html += `
        <button class="px-3 py-2 rounded-md bg-surface-container-low/50 border border-outline-variant/5 text-on-surface-variant/40 text-sm font-medium flex items-center gap-1 cursor-not-allowed opacity-50" disabled aria-label="Next Page">
          Next
          <span class="material-symbols-outlined text-base">chevron_right</span>
        </button>
      `;
    }

    pagination.innerHTML = html;
  }

  // Navigate to specific page
  function goToPage(page) {
    currentPage = page;
    renderBooks();
    updateURL();
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Update filters and re-render
  function updateFiltersAndRender() {
    currentPage = 1;
    renderBooks();
  }

  // Clear all filters
  function clearAllFilters() {
    searchInput.value = "";
    categorySelect.value = "";
    sortSelect.value = "newest";
    currentPage = 1;
    renderBooks();
    updateURL();
  }

  // URL parameter management
  function updateURL() {
    const params = new URLSearchParams();

    if (searchInput.value.trim()) {
      params.set("q", searchInput.value.trim());
    }

    if (categorySelect.value) {
      params.set("category", categorySelect.value);
    }

    if (sortSelect.value !== "newest") {
      params.set("sort", sortSelect.value);
    }

    if (currentPage > 1) {
      params.set("page", currentPage);
    }

    const newURL =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState({}, "", newURL);
  }

  // Load state from URL
  function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("q")) {
      searchInput.value = params.get("q");
    }

    if (params.has("category")) {
      categorySelect.value = params.get("category");
    }

    if (params.has("sort")) {
      sortSelect.value = params.get("sort");
    }

    if (params.has("page")) {
      currentPage = parseInt(params.get("page"), 10) || 1;
    } else {
      currentPage = 1;
    }
  }

  // Utility function: debounce
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Dark mode initialization (matching site theme)

  // Initialize everything when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
