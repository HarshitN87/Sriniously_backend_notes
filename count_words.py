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

def count_words(html_content):
    extractor = HTMLTextExtractor()
    extractor.feed(html_content)
    text = extractor.get_text()
    # Remove HTML tags just in case, and get word tokens
    words = re.findall(r'\b\w+\b', text)
    return len(words)

def main():
    workspace = r"c:\Users\negih\Computer_Science\Backend_Sriniously"
    html_files = sorted([f for f in os.listdir(workspace) if f.endswith('.html')])
    
    print(f"{'Filename':<40} | {'Word Count':<10} | {'Operational Consequences Counts':<30}")
    print("-" * 90)
    for filename in html_files:
        filepath = os.path.join(workspace, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        words = count_words(content)
        
        # Count occurrences of "Operational Consequences"
        ops_count = content.lower().count("operational consequences")
        
        print(f"{filename:<40} | {words:<10} | {ops_count:<30}")

if __name__ == '__main__':
    main()
