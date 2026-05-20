#!/usr/bin/env python3
"""Remove duplicated/corrupt inline <style> blocks and link styles.css."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STYLE_LINK = '  <link rel="stylesheet" href="styles.css">\n'
STYLE_BLOCK_RE = re.compile(r"<style\b[^>]*>.*?</style>\s*", re.DOTALL | re.IGNORECASE)
POLYGON_FILL_RE = re.compile(r'fill="#C9A84C"', re.IGNORECASE)
POLYGON_FILL_RE2 = re.compile(r"fill='#C9A84C'", re.IGNORECASE)


def refactor_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    text = STYLE_BLOCK_RE.sub("", text)

    if 'href="styles.css"' not in text and "href='styles.css'" not in text:
        head_close = text.lower().find("</head>")
        if head_close == -1:
            raise ValueError(f"No </head> in {path}")
        text = text[:head_close] + STYLE_LINK + text[head_close:]

    text = POLYGON_FILL_RE.sub('fill="var(--diagram-arrow)"', text)
    text = POLYGON_FILL_RE2.sub("fill='var(--diagram-arrow)'", text)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = []
    for path in sorted(ROOT.glob("*.html")):
        if refactor_file(path):
            changed.append(path.name)
    print(f"Updated {len(changed)} files:")
    for name in changed:
        print(f"  - {name}")


if __name__ == "__main__":
    main()
