import re
print("\n" + "="*60)
print("LESSON 5: Capturing Groups ( )")
print("-"*60)

line = "AIK24CE002 GYMAT101(F), GZPHT121(A+)"

# Without groups
pattern1 = r'[A-Z]{5}\d{3}\([A-Z+\-]+\)'
matches1 = re.findall(pattern1, line)
print(f"Without groups: {matches1}")

# With groups
pattern2 = r'([A-Z]{5}\d{3})\(([A-Z+\-]+)\)'
matches2 = re.findall(pattern2, line)
print(f"With groups: {matches2}")
print("\nNow we can separate course and grade:")
for course, grade in matches2:
    print(f"  Course: {course}, Grade: {grade}")

# Named groups (advanced!)
pattern3 = r'(?P<course>[A-Z]{6}\d{3})\((?P<grade>[A-Z+\-]+)\)'
match = re.search(pattern3, line)
if match:
    print(f"\nNamed groups:")
    print(f"  Course: {match.group('course')}")
    print(f"  Grade: {match.group('grade')}")