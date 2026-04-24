import sys

with open('index.js', 'r') as f:
    content = f.read()

start_marker = 'const htmlParts = ['
end_marker = '].join'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Markers not found")
    sys.exit(1)

block = content[start_idx:end_idx]

parts = []
in_backtick = False
current_part = []
i = 0
while i < len(block):
    if block[i] == '`':
        if in_backtick:
            parts.append("".join(current_part))
            current_part = []
            in_backtick = False
        else:
            in_backtick = True
    elif in_backtick:
        current_part.append(block[i])
    i += 1

print("".join(parts))
