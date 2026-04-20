# this for making the discord list frfr

import json

with open('./GameAssets/manifest.json', 'r') as file:
    data = json.load(file)

all_items = data['Games']

print("# ALL GAMES\n```")
for item in all_items:
    if "Tools" not in item.get("Tags", []):
        print(item.get("Name", "Unnamed Game"))
print("```\n# ALL TOOLS\n```")
for item in all_items:
    if "Tools" in item.get("Tags", []):
        print(item.get("Name", "Unnamed Game"))
print("```\nTotal:",len(all_items))