import os

TARGET_DIRS = ["_blog", "_til"]

def cleanup():
    count = 0
    print("Finding and removing test data...")
    
    for target in TARGET_DIRS:
        if not os.path.exists(target):
            continue
            
        for root, dirs, files in os.walk(target):
            for file in files:
                if not file.endswith(".md"):
                    continue
                    
                path = os.path.join(root, file)
                try:
                    with open(path, "r") as f:
                        content = f.read()
                        if "test_data: true" in content:
                            os.remove(path)
                            print(f"Removed: {path}")
                            count += 1
                except Exception as e:
                    print(f"Error reading {path}: {e}")
                    
    print(f"\nCleanup complete. Removed {count} test files.")

if __name__ == "__main__":
    cleanup()
