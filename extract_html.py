import sys

with open('index.js', 'r') as f:
    lines = f.readlines()

start = -1
end = -1
for i, line in enumerate(lines):
    if 'const html = `<!DOCTYPE html>' in line:
        start = i
    if '</html>`;' in line:
        end = i
        break

if start != -1 and end != -1:
    html = "".join(lines[start:end+1])
    # Strip the variable declaration and trailing backtick
    html = html.replace('    const html = `', '').replace('`;', '')
    # Handle the escaped backticks and dollar signs if any
    # Wait, in index.js I used \` and \${PENTAD_MAP}.
    # I should unescape them for index.html.
    html = html.replace('\\`', '`').replace('\\${', '${').replace('\\\\', '\\')
    # Replace ${JSON.stringify(PENTAD_MAP)} with actual JSON
    # I'll just do it manually for the test file if needed,
    # but wait, PENTAD_MAP is defined in index.js scope.
    # I'll just fix the template.
    print(html)
