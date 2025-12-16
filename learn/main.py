import re
text = """
AIK24CE001 scored 85 marks
AIK24ME002 scored 92 marks
AIK24CS003 scored 78 marks
Email: student@example.com
Phone: +91-9876543210
"""

print("Sample text:")
print(text)

# Pattern 1: Find exact text
print("\n1. EXACT MATCH - Find 'AIK24':")
matches = re.findall(r'AIK24', text)
print(f"   Found: {matches}")
print(f"   Count: {len(matches)}")
print("\n2. DIGITS - Find all numbers:")
matches = re.findall(r'\d+', text)  # + means "one or more"
print(f"   Found: {matches}")

# Pattern 3: \w means word character (a-z, A-Z, 0-9, _)
print("\n3. WORD CHARACTERS - Find email username:")
matches = re.findall(r'\w+@', text)
print(f"   Found: {matches}")

# Pattern 4: . means any character
print("\n4. ANY CHARACTER - Find 3-letter codes:")
matches = re.findall(r'AIK24..', text)
print(f"   Found: {matches}")