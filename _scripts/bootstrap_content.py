import os
import random
import argparse
from datetime import datetime, timedelta

LOREM_IPSUM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
    "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
    "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula."
]

CATEGORIES = ["Tech", "Life", "Work", "General"]

def generate_lorem(sentences=5):
    return " ".join(random.choices(LOREM_IPSUM, k=sentences))

def create_file(path, title, date, category, is_draft, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    published_str = "false" if is_draft else "true"
    
    front_matter = [
        "---",
        f"layout: post",
        f'title: "{title}"',
        f"date: {date.strftime('%Y-%m-%d')}",
        f"category: {category}",
        f"published: {published_str}",
        f"test_data: true",
        "---",
        "",
        content
    ]
    
    with open(path, "w") as f:
        f.write("\n".join(front_matter))

def bootstrap_blog(total, drafts):
    print(f"Bootstrapping {total} blog posts ({drafts} drafts)...")
    for i in range(total):
        is_draft = i < drafts
        days_ago = total - i
        date = datetime.now() - timedelta(days=days_ago)
        
        slug = f"test-blog-post-{i+1}"
        title = f"Test Blog Post {i+1} {'(Draft)' if is_draft else ''}"
        
        if is_draft:
            filename = f"{date.strftime('%Y-%m-%d')}-{slug}.md"
            path = os.path.join("_blog", "drafts", filename)
        else:
            filename = f"{date.strftime('%Y-%m-%d')}-{slug}.md"
            path = os.path.join("_blog", filename)
            
        create_file(path, title, date, random.choice(CATEGORIES), is_draft, generate_lorem())

def bootstrap_til(total, drafts):
    print(f"Bootstrapping {total} TIL entries ({drafts} drafts)...")
    for i in range(total):
        is_draft = i < drafts
        date = datetime.now() - timedelta(days=i)
        
        slug = f"test-til-{i+1}"
        title = f"What I Learned {i+1} {'(Draft)' if is_draft else ''}"
        
        if is_draft:
            path = os.path.join("_til", "drafts", f"{slug}.md")
        else:
            path = os.path.join("_til", f"{slug}.md")
            
        create_file(path, title, date, random.choice(CATEGORIES), is_draft, generate_lorem())

def main():
    parser = argparse.ArgumentParser(description="Bootstrap test content for Jekyll blog.")
    parser.add_argument("--blog-total", type=int, default=0, help="Total number of blog posts to create")
    parser.add_argument("--blog-drafts", type=int, default=0, help="Number of blog posts that should be drafts")
    parser.add_argument("--til-total", type=int, default=0, help="Total number of TIL entries to create")
    parser.add_argument("--til-drafts", type=int, default=0, help="Number of TIL entries that should be drafts")
    
    args = parser.parse_args()
    
    if args.blog_total > 0:
        bootstrap_blog(args.blog_total, args.blog_drafts)
        
    if args.til_total > 0:
        bootstrap_til(args.til_total, args.til_drafts)
        
    print("Done!")

if __name__ == "__main__":
    main()
