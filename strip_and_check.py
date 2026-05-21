import os
import re
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_script_or_style = False

    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style']:
            self.in_script_or_style = True

    def handle_endtag(self, tag):
        if tag in ['script', 'style']:
            self.in_script_or_style = False

    def handle_data(self, data):
        if not self.in_script_or_style:
            self.text.append(data)

    def get_text(self):
        return " ".join(self.text)

# We want to identify the generic paragraphs
GENERIC_SUBSTRINGS = [
    "beginner-friendly account of",
    "first question is always about trust",
    "second question is about distance",
    "third question is about crowding",
    "fourth question is about recovery",
    "beginner's mistake is to memorize the label",
    "indian administrative history is especially good",
    "clean diagram should make those separations visible",
    "safest mental model is to ask what would happen",
    "goal is not to make the machinery feel simple"
]

def clean_html_content(content):
    # Remove any Operational Consequences h2 and following generic p tags
    # Let's do it cleanly by searching for paragraphs that contain our generic substrings
    lines = content.splitlines()
    cleaned_lines = []
    skip_mode = False
    
    # We will strip out the Operational Consequences headers and any paragraphs containing the generic substrings
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if this line starts an Operational Consequences section
        if "<h2>operational consequences</h2>" in line.lower():
            # We skip this line
            i += 1
            continue
            
        # Check if this line is a p tag containing a generic substring
        is_generic = False
        for sub in GENERIC_SUBSTRINGS:
            if sub in line.lower():
                is_generic = True
                break
                
        if is_generic and ("<p>" in line.lower() or line.strip().startswith("<p>") or "</p>" in line.lower()):
            # Skip this paragraph
            i += 1
            continue
            
        cleaned_lines.append(line)
        i += 1
        
    return "\n".join(cleaned_lines)

def count_words(html_content):
    extractor = HTMLTextExtractor()
    extractor.feed(html_content)
    text = extractor.get_text()
    words = re.findall(r'\b\w+\b', text)
    return len(words)

def main():
    workspace = r"c:\Users\negih\Computer_Science\Backend_Sriniously"
    html_files = sorted([f for f in os.listdir(workspace) if f.endswith('.html')])
    
    print(f"{'Filename':<40} | {'Original':<10} | {'Cleaned':<10} | {'Status':<15}")
    print("-" * 85)
    for filename in html_files:
        filepath = os.path.join(workspace, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        orig_words = count_words(content)
        cleaned_content = clean_html_content(content)
        cleaned_words = count_words(cleaned_content)
        
        status = "OK" if cleaned_words >= 7000 else "NEEDS EXPANSION"
        print(f"{filename:<40} | {orig_words:<10} | {cleaned_words:<10} | {status:<15}")

if __name__ == '__main__':
    main()
