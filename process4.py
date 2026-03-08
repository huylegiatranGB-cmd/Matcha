import re

with open('Flowers-HTML-CSS/flower.html', 'r', encoding='utf-8') as f:
    flower_src = f.read()

# Extract inner content between <div class="flowers"> and the closing </div> before <script>
start_tag = '<div class="flowers">'
script_tag = '    <script src="main.js"></script>'
start_idx = flower_src.index(start_tag) + len(start_tag)
end_idx = flower_src.index(script_tag)
inner_raw = flower_src[start_idx:end_idx].rstrip()
# strip trailing </div> of flowers itself
if inner_raw.rstrip().endswith('</div>'):
    inner_raw = inner_raw.rstrip()[:-6].rstrip()

# Indent nicely
indented = '\n'.join(('        ' + line if line.strip() else '') for line in inner_raw.split('\n'))

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the hero section - it currently looks like:
#     <div class="scroll-line">...</div>
#     </div>          <-- stray extra closing div from previous bad injection
#   </div>            <-- hero closing div
# We need to:
# 1. Remove the stray </div>
# 2. Add flowers-left and flowers-right before hero closing div

NEW_HERO_TAIL = f'''    <div class="scroll-line">Cuộn xuống</div>

    <!-- FLOWERS LEFT -->
    <div class="hero-flower-left">
      <div class="flowers flowers--left">
{indented}
      </div>
    </div>

    <!-- FLOWERS RIGHT -->
    <div class="hero-flower-right">
      <div class="flowers flowers--right">
{indented}
      </div>
    </div>
  </div>'''

# Replace the problematic sequence
html = re.sub(
    r'    <div class="scroll-line">Cuộn xuống</div>\s*</div>\s*</div>',
    NEW_HERO_TAIL,
    html
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Fixed. Flower inner lines: {len(indented.split(chr(10)))}")
