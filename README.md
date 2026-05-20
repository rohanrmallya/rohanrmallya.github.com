# Rohan Mallya – Personal Portfolio & Blog

An architectural, minimalist, and performance-oriented personal website built with **Jekyll 4** and **Tailwind CSS v4**.

---

## Setup

### Prerequisites

- **Ruby 3.x** & **Bundler**
- **Node.js 18+** & **npm**

### Installation

1. **Install Ruby dependencies:**
   ```bash
   bundle install
   ```
2. **Install Node dependencies:**
   ```bash
   npm install
   ```

### Development

You can run the development server in different modes depending on whether you want to preview drafts, unpublished, or future-dated content.

#### Option A: Running with local Jekyll (Recommended)

- **Production Preview (No drafts, unpublished, or future posts):**
  ```bash
  bundle exec jekyll serve
  ```
- **Development Preview (Includes drafts, unpublished, and future posts):**
  ```bash
  bundle exec jekyll serve --drafts --unpublished --future
  ```

#### Option B: Running with Docker

- **Development Preview (Includes drafts, unpublished, and future posts):**
  ```bash
  ./run.sh
  ```

---

## 📝 Drafts Support

Drafts are supported for both **Blog** and **TIL** sections.

### Draft Locations:

- **Blog Drafts:** Placed under `_blog/drafts/` (e.g. `_blog/drafts/my-draft-post.md`).
- **TIL Drafts:** Placed under `_til/drafts/` (e.g. `_til/drafts/my-draft-til.md`).

### Draft Front Matter:

For a file to be treated as a draft or unpublished, set `published: false` in the front matter:

```yaml
published: false
```

## 🎨 Tailwind CSS v4 + Jekyll Integration

This project uses the modern **Tailwind v4 "CSS-first" approach**. Unlike previous versions, configuration is primarily handled within the CSS files using the `@theme` block.

### How it works:

- **Pipeline**: We use the `jekyll-postcss-v2` plugin to pipe Jekyll's asset processing into **PostCSS**.
- **Engine**: The `@tailwindcss/postcss` plugin (v4) reads `assets/stylesheets/main.css` and generates the necessary utilities based on your HTML/Markdown content.
- **Theme Configuration**: All custom colors (the "Liquid Monolith" system), fonts, and border radii are defined directly in the `@theme` block in `assets/stylesheets/main.css`.

### ⚠️ The Front Matter Requirement

For Tailwind to compile, `assets/stylesheets/main.css` **must** start with YAML front matter:

```css
---
---

@import "tailwindcss";
```

This empty block tells Jekyll to process the file through the PostCSS/Tailwind pipeline rather than treating it as a static asset. If removed, the UI will break as the browser won't understand the raw Tailwind imports.

---

## 🛠 Maintenance & Updates

To keep the project secure and up-to-date with the latest features, follow these steps:

### Updating Bundler & Ruby Gems

If you see a warning about lockfile versions or want to update Jekyll/plugins:

```bash
# Update the Bundler version in Gemfile.lock
bundle update --bundler

# Update Jekyll and all other gems to their latest allowed versions
bundle update
```

### Updating NPM Packages

To update Tailwind, PostCSS, and other Node-based tools:

```bash
# Check for outdated packages and update them
npm update

# Or update a specific package to the latest version
npm install tailwindcss@latest
```

---

## 📂 Project Structure

- `_til/`: Markdown entries for the "Today I Learned" section.
- `_blog/`: Blog essays and deep-dives.
- `_notes/`: Markdown entries for Book Notes.
- `_data/book.yml`: Data source for the Bookshelf section.
- `_layouts/`: Base HTML templates and layouts.
- `assets/stylesheets/main.css`: The "Source of Truth" for all styling and design tokens.

---

## 📝 Content Creation & Management

### 1. Blog & TIL (Today I Learned) Entries

When creating a new Blog post or TIL entry, create a markdown file under `_blog/` or `_til/` respectively. Include the following YAML front matter at the top of your file:

```yaml
---
layout: post # Use til_single for TIL
title: "Your Post Title"
date: YYYY-MM-DD
category: YourCategory
published: true # Set to false to keep as a draft
read_time: 2 # Default: 5 minutes
---
```

### 2. Bookshelf

To add a book to the bookshelf page, append a new entry to `_data/book.yml`:

```yaml
- title: "Book Title"
  author: "Author Name"
  link: "https://example.com/amazon-link" # Optional: link to buy/detail page
  category: "CategoryName" # Optional: for filtering
  date_finished: "YYYY-MM-DD" # Optional: ISO date string
  notes_url: "/bookshelf/notes/your-note-slug/" # Optional: link to note page
```

### 3. Book Notes

If a book has notes, you can write them as a note page that looks like a post but redirects back to the bookshelf:

1. **Create a markdown file** under `_notes/` (e.g. `_notes/your-note-slug.md`).
2. **Add the note layout front matter**:
   ```yaml
   ---
   layout: note
   title: "Notes on: Book Title"
   date: YYYY-MM-DD
   category: "CategoryName" # Match the book's category
   read_time: 5 # Estimated reading time in minutes
   ---
   ```
3. **Write your notes** in markdown below the front matter.
4. **Link the book**: Make sure the `notes_url` property of the book in `_data/book.yml` points to `/bookshelf/notes/your-note-slug/` so the badge is rendered on the book card.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
