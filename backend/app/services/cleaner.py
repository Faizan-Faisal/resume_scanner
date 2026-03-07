import re

def clean_text(text):
    # Normalize Windows/Mac line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Remove trailing spaces per line
    text = "\n".join(line.strip() for line in text.split("\n"))

    # Remove excessive blank lines (keep structure)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Fix weird spaced dates like J a n  2 0 2 1
    text = re.sub(r'(\b[A-Z])\s+(?=[a-z])', r'\1', text)

    return text.strip()