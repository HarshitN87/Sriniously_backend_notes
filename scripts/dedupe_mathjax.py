#!/usr/bin/env python3
"""Keep a single MathJax 3 script per HTML file."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATHJAX_RE = re.compile(
    r"\s*<script[^>]*(?:mathjax|MathJax)[^>]*>.*?</script>",
    re.DOTALL | re.IGNORECASE,
)
CANONICAL = (
    '  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>\n'
)


def clean(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    needs_mathjax = "math-block" in text or r"\(" in text or r"\[" in text
    stripped = MATHJAX_RE.sub("", text)
    if needs_mathjax:
        if CANONICAL.strip() not in stripped:
            link = stripped.find('href="styles.css"')
            if link != -1:
                line_start = stripped.rfind("\n", 0, link) + 1
                stripped = stripped[:line_start] + CANONICAL + stripped[line_start:]
            else:
                head_close = stripped.lower().find("</head>")
                stripped = stripped[:head_close] + CANONICAL + stripped[head_close:]
    if stripped != text:
        path.write_text(stripped, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    n = sum(1 for p in ROOT.glob("*.html") if clean(p))
    print(f"Cleaned {n} files")


if __name__ == "__main__":
    main()
