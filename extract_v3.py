import re

with open('index.js', 'r') as f:
    content = f.read()

# Find the htmlParts array
start_marker = 'const htmlParts = ['
end_marker = '].join'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    block = content[start_idx:end_idx]
    # Use regex to find all single-quoted strings (as they are now used in the join)
    parts = re.findall(r"'(.*?)'", block, re.DOTALL)
    print("".join(parts))
else:
    print("Markers not found")
