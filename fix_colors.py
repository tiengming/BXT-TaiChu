import re

with open("index.js", "r") as f:
    content = f.read()

# Refine applyTheme logic
theme_logic = """        applyTheme(color, nightOpacity) {
            const root = document.documentElement;
            const rgb = this.hexToRgb(color);
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            const isDark = brightness < 128;
            const inkColor = isDark ? "#FFFFFF" : "#1E2732";

            // Elegant GSAP transition for multiple properties
            gsap.to(root, {
                '--theme-color': color,
                '--night-opacity': nightOpacity,
                '--color-ink': inkColor,
                duration: 2.5,
                ease: "power2.inOut"
            });

            // Extra contrast for specific elements if needed
            root.style.setProperty('--ink-contrast', isDark ? "0.1" : "0.04");
        },"""

content = re.sub(r"applyTheme\(color, nightOpacity\) \{.*?\},", theme_logic, content, flags=re.DOTALL)

with open("index.js", "w") as f:
    f.write(content)
