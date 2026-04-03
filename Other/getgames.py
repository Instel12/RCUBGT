# this for making the discord list frfr

import json

with open('./GameAssets/manifest.json', 'r') as file:
    data = json.load(file)

all_items = data['Games']

print("# ALL GAMES\n```")
for item in all_items:
    print(item["Name"])
print("```")