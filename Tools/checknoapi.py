import os

issues = 0

script_dir = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.join(script_dir, "..", "GameAssets")

for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)

    if not os.path.isdir(folder_path):
        continue

    index_path = os.path.join(folder_path, "index.html")

    if not os.path.exists(index_path):
        continue

    with open(index_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    if '<script src="https://instel12.github.io/RCUBGT/Assets/api/api.js"></script>' not in content:
        print(folder)
        issues += 1

if issues == 0:
    print("ur good")