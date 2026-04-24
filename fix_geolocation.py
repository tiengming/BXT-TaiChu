import re

with open("index.js", "r") as f:
    content = f.read()

# Fix CONFIG block completely
config_regex = r"const CONFIG = \{.*?\};"
new_config = """const CONFIG = {
        DOJO_COORD: { lat: 36.25, lon: 117.10 },
        PENTAD_MAP: ${JSON.stringify(PENTAD_MAP)},
        USER_LOCATION: {
            lat: request.cf?.latitude || 36.25,
            lon: request.cf?.longitude || 117.10,
            city: request.cf?.city || "泰安"
        }
    };"""

content = re.sub(config_regex, new_config, content, flags=re.DOTALL)

with open("index.js", "w") as f:
    f.write(content)
