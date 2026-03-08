import os
import re

# 1. Process flowers.css
css_path = 'flowers.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Find where .flowers { starts and keep from there
idx = css_content.find('.flowers {')
if idx != -1:
    css_content = css_content[idx:]
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
        
# 2. Extract HTML from flower.html
flower_html_path = 'Flowers-HTML-CSS/flower.html'
with open(flower_html_path, 'r', encoding='utf-8') as f:
    f_html = f.read()

# Extract the flowers div
start_idx = f_html.find('<div class="flowers">')
end_idx = f_html.find('    <script src="main.js"></script>')
extracted_flowers = f_html[start_idx:end_idx]

# Wrap it completely so it doesn't block clicks and fits the hero
wrapper = f"""
    <!-- NEW GITHUB FLOWERS -->
    <div class="hero-flowers-wrapper" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; overflow: hidden;">
{extracted_flowers}
    </div>
"""

# 3. Inject into index.html
index_path = 'index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    index_html = f.read()

# Add CSS link
if '<link rel="stylesheet" href="flowers.css">' not in index_html:
    index_html = index_html.replace('</head>', '  <link rel="stylesheet" href="flowers.css">\n</head>')

# Add HTML to .hero before branch-scene
if '<!-- NEW GITHUB FLOWERS -->' not in index_html:
    index_html = index_html.replace('<!-- SVG branches at bottom -->', wrapper + '\n    <!-- SVG branches at bottom -->')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_html)

# 4. Remove old JS flowers from script.js
script_path = 'script.js'
with open(script_path, 'r', encoding='utf-8') as f:
    script_content = f.read()

# We need to remove the whole block:
# /* ─── 3. CSS FLOWERS on HERO ─── */
# (function () {
# ...
# })();

import re
script_content = re.sub(r'/\* ─── 3\. CSS FLOWERS on HERO ─── \*/\s*\(function \(\) \{.*?\}\)\(\);\s*', '', script_content, flags=re.DOTALL)

with open(script_path, 'w', encoding='utf-8') as f:
    f.write(script_content)

print("Processing complete.")
