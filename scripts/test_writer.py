import re

def clean_file(path, pairs):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    for a, b in pairs:
        if isinstance(a, str):
            text = text.replace(a, b)
        else:
            text = a.sub(b, text)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('Cleaned:', path)

print('Testing python script creation')
