import re

with open("index.js", "r") as f:
    content = f.read()

# Replace the bg-texture SVG and add background-repeat: repeat
old_bg = r"background-image: url\('data:image/svg\+xml;utf8,<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"noiseFilter\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0\.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url\(%23noiseFilter\)\" opacity=\"var\(--vignette-opacity\)\"/></svg>'\);"
new_bg = "background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\");\n            background-repeat: repeat;\n            opacity: var(--vignette-opacity);"

content = re.sub(old_bg, new_bg, content)

with open("index.js", "w") as f:
    f.write(content)
