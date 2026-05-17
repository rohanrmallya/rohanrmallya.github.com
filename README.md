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

Start the standard Jekyll server:

```bash
bundle exec jekyll serve
```

To run a local development server with Docker that includes drafts, unpublished posts, and future posts:

```bash
./run.sh
```

---

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
- `_data/book/`: Data source for the Bookshelf section.
- `_layouts/`: Base HTML templates and layouts.
- `assets/stylesheets/main.css`: The "Source of Truth" for all styling and design tokens.

---

## 📝 Content Creation Template

When creating a new Blog post or TIL (Today I Learned) entry, include the following YAML front matter at the top of your Markdown file:

```yaml
---
layout: post # use til_single for TIL
title: "Your Post Title"
date: YYYY-MM-DD
category: YourCategory
published: true # Set to false to keep as a draft
read_time: 2 # Default: 5 minutes
---
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
