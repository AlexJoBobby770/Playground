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