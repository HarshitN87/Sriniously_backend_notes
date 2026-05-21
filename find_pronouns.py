import os
import re

def find_pronouns_in_file(filepath, out_f):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    banned_pronouns = ['we', 'us', 'our', 'my', 'me', 'myself', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves']
    pattern = r'\b(' + '|'.join(banned_pronouns) + r')\b'
    pattern_i = r'\bi\b' # lowercase i
    
    filename = os.path.basename(filepath)
    has_matches = False
    for idx, line in enumerate(lines):
        clean_line = re.sub(r'<[^>]+>', ' ', line)
        
        matches = re.findall(pattern, clean_line.lower())
        matches_i = re.findall(pattern_i, clean_line)
        matches_I = []
        for m in re.finditer(r'\bI\b', clean_line):
            context = clean_line.strip()
            if context.startswith("I.") or context.startswith("II.") or context.startswith("III.") or context.startswith("IV.") or context.startswith("V.") or context.startswith("VI.") or context.startswith("VII.") or context.startswith("VIII.") or context.startswith("IX.") or context.startswith("X."):
                continue
            if re.search(r'<(h[1-6]|li|dt|dd)[^>]*>\s*I[\.\s]', line):
                continue
            matches_I.append("I")
            
        all_matches = matches + matches_i + matches_I
        if all_matches:
            if not has_matches:
                out_f.write(f"\n--- {filename} ---\n")
                has_matches = True
            out_f.write(f"  Line {idx+1}: {all_matches} -> {line.strip()}\n")

def main():
    workspace = r"c:\Users\negih\Computer_Science\Backend_Sriniously"
    html_files = sorted([f for f in os.listdir(workspace) if f.endswith('.html')])
    
    with open(os.path.join(workspace, "pronoun_audit.txt"), 'w', encoding='utf-8') as out_f:
        for filename in html_files:
            filepath = os.path.join(workspace, filename)
            find_pronouns_in_file(filepath, out_f)
    print("Pronoun audit complete! Output written to pronoun_audit.txt")

if __name__ == '__main__':
    main()


