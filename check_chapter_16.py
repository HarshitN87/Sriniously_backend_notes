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

def check_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    extractor = HTMLTextExtractor()
    extractor.feed(content)
    text = extractor.get_text()

    # Calculate visible word count
    words = re.findall(r'[A-Za-z0-9]+(?:[-\'][A-Za-z0-9]+)*', text)
    word_count = len(words)

    # Banned first-person pronouns
    banned_pronouns = ['i', 'we', 'us', 'our', 'my', 'me', 'myself', 'ourselves']
    pronoun_matches = []
    
    # Simple word tokenizer for checking pronouns
    all_words = re.findall(r'\b\w+\b', text.lower())
    for w in all_words:
        if w in banned_pronouns:
            pronoun_matches.append(w)

    print(f"--- Analysis for {os.path.basename(filepath)} ---")
    print(f"Visible Word Count: {word_count}")
    print(f"Banned Pronouns Found: {len(pronoun_matches)}")
    if pronoun_matches:
        from collections import Counter
        print(f"Pronoun Details: {dict(Counter(pronoun_matches))}")
    print("-------------------------------------")

if __name__ == '__main__':
    check_file(r"c:\Users\negih\Computer_Science\Backend_Sriniously\16_configuration_management.html")
