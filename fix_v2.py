import sys

with open('index.js', 'r') as f:
    content = f.read()

# Fix the accidental closing brace and semicolon
old_block = """    const geo = {
      lat: cf.latitude,
      lon: cf.longitude,
      city: cf.city || cf.region || "未知"
    };

    };"""

new_block = """    const geo = {
      lat: cf.latitude,
      lon: cf.longitude,
      city: cf.city || cf.region || "未知"
    };"""

content = content.replace(old_block, new_block)

# Fix the script injection to correctly use backticks for the template string
script_injection = '<script>window.INITIAL_GEO = ${JSON.stringify(geo)};</script>'
proper_injection = '<script>window.INITIAL_GEO = ${JSON.stringify(geo)};</script>'
# Wait, I need to make sure the replacement in the JS file uses the actual variable in the template literal.

with open('index.js', 'w') as f:
    f.write(content)
