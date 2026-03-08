import re

# Read the original flower HTML from the repo
with open('Flowers-HTML-CSS/flower.html', 'r', encoding='utf-8') as f:
    flower_src = f.read()

# Extract everything between <div class="flowers"> ... </div> (before </body>)
# Use a more generous greedy match
start_tag = '<div class="flowers">'
end_tag_before = '    <script src="main.js"></script>'
start_idx = flower_src.index(start_tag) + len(start_tag)
end_idx = flower_src.index(end_tag_before)
flower_inner = flower_src[start_idx:end_idx].rstrip()
# Remove the closing </div> at very end of inner content
# The closing </div> for .flowers is the last one before script
if flower_inner.rstrip().endswith('</div>'):
    flower_inner = flower_inner.rstrip()[:-6].rstrip()

# Indent all inner content 8 spaces for readability
indented = '\n'.join('        ' + line if line.strip() else line for line in flower_inner.split('\n'))

LEFT_BLOCK = f"""
    <!-- FLOWERS LEFT -->
    <div class="hero-flower-left">
      <div class="flowers flowers--left">
{indented}
      </div>
    </div>"""

RIGHT_BLOCK = f"""
    <!-- FLOWERS RIGHT -->
    <div class="hero-flower-right">
      <div class="flowers flowers--right">
{indented}
      </div>
    </div>"""

# Read current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove leftover empty flower divs
html = re.sub(
    r'\n?    <!-- FLOWERS LEFT -->.*?<!-- FLOWERS RIGHT -->.*?</div>\s*\n',
    '\n',
    html, flags=re.DOTALL
)

# Insert after scroll-line
html = html.replace(
    '    <div class="scroll-line">Cuộn xuống</div>\n  </div>',
    '    <div class="scroll-line">Cuộn xuống</div>' + LEFT_BLOCK + RIGHT_BLOCK + '\n  </div>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Done. Injected {len(indented.split(chr(10)))} lines of flower content into both sides.")
