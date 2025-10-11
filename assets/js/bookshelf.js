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
        "px-3 py-1 text-sm rounded-full border border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
      chip.textContent = category;
      chip.setAttribute("data-category", category);
      chip.addEventListener("click", () => {
        categorySelect.value = category;
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
        chip.classList.add("bg-primary", "text-white");
        chip.classList.remove(
          "text-primary",
          "dark:text-primary",
          "hover:bg-primary",
          "hover:text-white"
        );
      } else {
        chip.classList.remove("bg-primary", "text-white");
        chip.classList.add(
          "text-primary",
          "hover:bg-primary",
          "hover:text-white"
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
            <article class="bg-white dark:bg-background-dark-elevated rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full">
              <div>
                ${
                  book.link
                    ? `<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors">
                        <a href="${book.link}" target="_blank" rel="noopener noreferrer" class="focus:outline-none focus:underline">
                          ${book.title}
                        </a>
                      </h3>`
                    : `<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${book.title}</h3>`
                }
                ${
                  book.subtitle
                    ? `<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">${book.subtitle}</p>`
                    : ""
                }
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">by ${
                  book.author
                }</p>
              </div>
              <div class="flex items-center justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                ${
                  book.category
                    ? `<span class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">${book.category}</span>`
                    : ""
                }
                <time class="text-xs text-gray-500 dark:text-gray-400" datetime="${
                  book.date_finished || ""
                }">${formatDate(book.date_finished)}</time>
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
