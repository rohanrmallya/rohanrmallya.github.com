(function () {
  // State management
  let currentBooks = [];
  let filteredBooks = [];
  let allCategories = [];

  // DOM elements
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categorySelect = document.getElementById("categorySelect");
  const categoryChips = document.getElementById("categoryChips");
  const booksGrid = document.getElementById("booksGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

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

  // Populate category dropdown and chips
  function populateCategoryControls() {
    // Populate dropdown
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    allCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    // Populate chips
    categoryChips.innerHTML = "";
    allCategories.forEach((category) => {
      const chip = document.createElement("button");
      chip.className =
        "px-4 py-1.5 rounded-lg text-[0.7rem] font-semibold uppercase tracking-[0.05em] bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-v2-primary focus:ring-offset-2";
      chip.textContent = category;
      chip.setAttribute("data-category", category);
      chip.addEventListener("click", () => {
        const currentCategory = categorySelect.value;
        if (currentCategory === category) {
          categorySelect.value = ""; // Toggle off if already selected
        } else {
          categorySelect.value = category;
        }
        updateFiltersAndRender();
      });
      categoryChips.appendChild(chip);
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    searchInput.addEventListener(
      "input",
      debounce(updateFiltersAndRender, 300)
    );
    sortSelect.addEventListener("change", updateFiltersAndRender);
    categorySelect.addEventListener("change", updateFiltersAndRender);
    clearFiltersBtn.addEventListener("click", clearAllFilters);

    // Update URL on filter changes
    [searchInput, sortSelect, categorySelect].forEach((element) => {
      element.addEventListener("change", updateURL);
      element.addEventListener("input", debounce(updateURL, 500));
    });

    // Update active chip state
    categorySelect.addEventListener("change", updateChipStates);
  }

  // Update active state of category chips
  function updateChipStates() {
    const selectedCategory = categorySelect.value;
    categoryChips.querySelectorAll("button").forEach((chip) => {
      const chipCategory = chip.getAttribute("data-category");
      if (chipCategory === selectedCategory) {
        chip.classList.add("bg-v2-primary-container", "text-on-primary-container");
        chip.classList.remove(
          "bg-surface-container-highest",
          "text-on-surface-variant",
          "hover:text-on-surface"
        );
      } else {
        chip.classList.remove("bg-v2-primary-container", "text-on-primary-container");
        chip.classList.add(
          "bg-surface-container-highest",
          "text-on-surface-variant",
          "hover:text-on-surface"
        );
      }
    });
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

  // Render books grid
  function renderBooks() {
    filterAndSortBooks();

    // Update results count
    const count = filteredBooks.length;
    resultsCount.textContent = `Showing ${count} book${count !== 1 ? "s" : ""}`;

    // Show/hide empty state
    if (filteredBooks.length === 0) {
      booksGrid.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }

    booksGrid.classList.remove("hidden");
    emptyState.classList.add("hidden");

    // Render book cards
    booksGrid.innerHTML = filteredBooks
      .map(
        (book) => `
            <article class="group bg-surface-container-low hover:bg-surface-container p-5 rounded-lg transition-all duration-300 flex flex-col h-[220px] relative border border-outline-variant/10">
              <div class="mb-3">
                ${
                  book.category
                    ? `<span class="text-[0.6rem] font-bold uppercase tracking-[0.05em] text-v2-primary px-1.5 py-0.5 bg-v2-primary/10 rounded">${book.category}</span>`
                    : ""
                }
              </div>
              
              ${
                book.link
                  ? `<h3 class="text-[1.1rem] font-semibold tracking-tight leading-tight mb-1 group-hover:text-v2-primary transition-colors line-clamp-2">
                      <a href="${book.link}" target="_blank" rel="noopener noreferrer" class="focus:outline-none after:absolute after:inset-0">
                        ${book.title}
                      </a>
                    </h3>`
                  : `<h3 class="text-[1.1rem] font-semibold tracking-tight leading-tight mb-1 group-hover:text-v2-primary transition-colors line-clamp-2">${book.title}</h3>`
              }
              
              <p class="text-on-surface-variant text-xs mb-4">${book.author}</p>
              
              <div class="mt-auto pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                <time class="text-[0.6rem] font-medium text-outline uppercase" datetime="${
                  book.date_finished || ""
                }">${formatDate(book.date_finished)}</time>
                <span class="material-symbols-outlined text-outline group-hover:text-v2-primary transition-colors text-base">auto_stories</span>
              </div>
            </article>
          `
      )
      .join("");

    // Update chip states
    updateChipStates();
  }

  // Update filters and re-render
  function updateFiltersAndRender() {
    renderBooks();
  }

  // Clear all filters
  function clearAllFilters() {
    searchInput.value = "";
    categorySelect.value = "";
    sortSelect.value = "newest";
    updateURL();
    renderBooks();
  }

  // URL parameter management
  function updateURL() {
    const params = new URLSearchParams();

    if (searchInput.value.trim()) {
      params.set("q", searchInput.value.trim());
    }

    if (categorySelect.value) {
      categorySelect.value = params.get("category");
    }

    if (sortSelect.value !== "newest") {
      params.set("sort", sortSelect.value);
    }

    const newURL =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState({}, "", newURL);
  }

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
