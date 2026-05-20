#!/usr/bin/env python3
"""Replace CSS variables in SVG with hardcoded Wes Anderson hex colors."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REPLACEMENTS = [
    ('stroke="var(--color-navy)"', 'stroke="#2C2416"'),
    ('stroke="var(--color-charcoal)"', 'stroke="#2C2416"'),
    ('stroke="var(--color-coral)"', 'stroke="#D4A5A0"'),
    ('stroke="var(--color-mint)"', 'stroke="#8FAF8A"'),
    ('stroke="var(--color-mustard)"', 'stroke="#C9A84C"'),
    ('stroke="var(--bg-sand)"', 'stroke="#F5F0E8"'),
    ('fill="var(--color-navy)"', 'fill="#2C2416"'),
    ('fill="var(--color-charcoal)"', 'fill="#2C2416"'),
    ('fill="var(--color-mint)"', 'fill="#8FAF8A"'),
    ('fill="var(--color-mustard)"', 'fill="#C9A84C"'),
    ('fill="var(--color-coral)"', 'fill="#D4A5A0"'),
    ('fill="var(--color-pink)"', 'fill="#D4A5A0"'),
    ('fill="var(--accent-rose)"', 'fill="#D4A5A0"'),
    ('fill="var(--accent-sage)"', 'fill="#8FAF8A"'),
    ('fill="var(--accent-mustard)"', 'fill="#C9A84C"'),
    ('fill="var(--accent-blue)"', 'fill="#A8BFD0"'),
    ('fill="var(--bg-cream)"', 'fill="#FAF6EF"'),
    ('fill="var(--bg-sand)"', 'fill="#F5F0E8"'),
    ('fill="var(--bg-code)"', 'fill="#F5F0E8"'),
    ('fill="var(--diagram-arrow)"', 'fill="#C9A84C"'),
    ('font-family="var(--font-mono-accent)"', 'font-family="JetBrains Mono, monospace"'),
    ('font-family="var(--font-sans)"', 'font-family="Jost, sans-serif"'),
    ('font-family="var(--font-serif-body)"', 'font-family="Playfair Display, serif"'),
]


def process(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    if "<svg" not in text:
        return False
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = [p.name for p in sorted(ROOT.glob("*.html")) if process(p)]
    print(f"Updated {len(changed)} files")


if __name__ == "__main__":
    main()
