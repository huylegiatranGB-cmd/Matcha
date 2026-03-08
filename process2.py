import re

# ─── 1. Patch index.html ─────────────────────────────────────────────────────
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Flower inner content (everything inside .flowers > ...)
FLOWER_INNER = open('Flowers-HTML-CSS/flower.html', 'r', encoding='utf-8').read()
# Extract just the inner content of <div class="flowers">...</div>
m = re.search(r'<div class="flowers">(.*?)</div>\s*\n\s*</body>', FLOWER_INNER, re.DOTALL)
flower_inner = m.group(1).strip() if m else ''

LEFT_BLOCK = f'''
    <!-- FLOWERS LEFT -->
    <div class="hero-flower-left">
      <div class="flowers flowers--left">
{flower_inner}
      </div>
    </div>'''

RIGHT_BLOCK = f'''
    <!-- FLOWERS RIGHT -->
    <div class="hero-flower-right">
      <div class="flowers flowers--right">
{flower_inner}
      </div>
    </div>'''

# Remove old hero-flowers-wrapper block
html = re.sub(
    r'\n?\s*<!-- NEW GITHUB FLOWERS -->.*?</div>\s*\n\s*(?=<!-- SVG)',
    '\n',
    html, flags=re.DOTALL
)

# Remove branch-scene SVG block entirely
html = re.sub(
    r'\n?\s*<!-- SVG branches at bottom -->.*?</div>\s*\n',
    '\n',
    html, flags=re.DOTALL
)

# Insert flower blocks before </div>  <!-- end hero -->
html = html.replace(
    '    <div class="scroll-line">Cuộn xuống</div>',
    '    <div class="scroll-line">Cuộn xuống</div>' + LEFT_BLOCK + RIGHT_BLOCK
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html patched")

# ─── 2. Patch flowers.css – recolor teal→matcha green ─────────────────────────
with open('flowers.css', 'r', encoding='utf-8') as f:
    css = f.read()

replacements = [
    ('#39c6d6', '#7ab030'),   # bright teal  → fresh green
    ('#a7ffee', '#c8e87a'),   # light teal   → light matcha
    ('#54b8aa', '#5a7a1f'),   # dark teal    → dark olive
    ('#14757a', '#4a6e10'),   # deep teal    → deep forest
    ('#159faa', '#5a8c1f'),   # medium teal  → medium green
    ('#079097', '#4a7a10'),   # muted teal   → muted green
    ('#23f0ff', '#a8d84a'),   # cyan accent  → yellow-green
    ('#6bf0ff', '#c8e87a'),   # pale cyan    → pale matcha
    ('rgb(0, 255, 250)',      'rgb(126, 190, 60)'),   # teal rgb → green rgb
    ('rgba(145, 233, 255, 0.2)', 'rgba(168, 216, 74, 0.2)'),
]

for old, new in replacements:
    css = css.replace(old, new)

# Darken flowers a bit by boosting opacity of dark overlay
css = css.replace(
    'background-color: rgba(0, 0, 0, 0.6)',
    'background-color: rgba(0, 0, 0, 0.25)'   # lighter overlay so green shows
)

with open('flowers.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("flowers.css recolored to matcha green")

# ─── 3. Patch flowers-override.css with left/right placement ──────────────────
override_css = """/* GitHub Flowers – Side Placement Override */

/* Shared base */
.hero-flower-left,
.hero-flower-right {
    position: absolute;
    bottom: -80px;
    z-index: 2;
    pointer-events: none;
    overflow: visible;
}

/* Left: anchor to left edge, grow toward center */
.hero-flower-left {
    left: -60px;
    transform-origin: bottom left;
}
.hero-flower-left .flowers {
    transform: scale(0.42) translateX(0);
    transform-origin: bottom left;
}

/* Right: anchor to right edge, mirror horizontally, grow toward center */
.hero-flower-right {
    right: -60px;
    transform-origin: bottom right;
}
.hero-flower-right .flowers {
    transform: scale(0.42) scaleX(-1);
    transform-origin: bottom right;
}

@media (max-width: 900px) {
    .hero-flower-left .flowers,
    .hero-flower-right .flowers {
        transform: scale(0.28);
    }
    .hero-flower-right .flowers {
        transform: scale(0.28) scaleX(-1);
    }
}

@media (max-width: 600px) {
    .hero-flower-left, .hero-flower-right { display: none; }
}
"""

with open('flowers-override.css', 'w', encoding='utf-8') as f:
    f.write(override_css)

print("flowers-override.css updated for side placement")
