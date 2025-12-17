import re
print("\n" + "="*60)
print("LESSON 4: Important Regex Functions")
print("-"*60)

sample = "AIK24CE002 GYMAT101(F), GZPHT121(F)"

# Function 1: re.findall() - Find all matches
print("\n1. re.findall() - Find ALL matches")
matches = re.findall(r'\d+', sample)
print(f"   Find all numbers: {matches}")

# Function 2: re.search() - Find FIRST match
print("\n2. re.search() - Find FIRST match")
match = re.search(r'AIK24\w+', sample)
if match:
    print(f"   Found: {match.group()}")
    print(f"   Position: {match.start()} to {match.end()}")

# Function 3: re.match() - Match at START
print("\n3. re.match() - Match from START of string")
match = re.match(r'AIK24', sample)
if match:
    print(f"   Matched: {match.group()}")
else:
    print(f"   No match")

# Function 4: re.sub() - Replace matches
print("\n4. re.sub() - Replace/Substitute")
result = re.sub(r'\(F\)', '(FAIL)', sample)
print(f"   Original: {sample}")
print(f"   Replaced: {result}")

# Function 5: re.split() - Split by pattern
print("\n5. re.split() - Split by pattern")
parts = re.split(r',\s*', sample)
print(f"   Split by comma: {parts}")