import re, os

def replace_in_file(path, pairs):
    with open(path, 'r', encoding='utf-8') as f:
        s = f.read()
    for a, b in pairs:
        s = s.replace(a, b)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(s)
    print('Cleaned', path)
