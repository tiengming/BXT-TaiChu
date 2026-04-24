import re

with open('index.js', 'r') as f:
    content = f.read()

# Find the list of strings between [ and ].join
start = content.find('const htmlParts = [')
end = content.find('].join', start)
if start == -1 or end == -1:
    print("Markers not found")
    exit(1)

parts_content = content[start + len('const htmlParts = ['):end]

# Match all backtick strings
parts = re.findall(r'`([\s\S]*?)`', parts_content)
print("".join(parts))
