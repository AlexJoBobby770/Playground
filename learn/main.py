print("\n" + "="*60)
print("LESSON 2: Nested Structures (The Power Move!)")
print("-"*60)

import json
# Simple dictionary
simple = {"name": "John", "score": 85}
print("Simple dict:", simple)

# Nested dictionary (dictionary inside dictionary)
student = {
    "register_no": "AIK24CS001",
    "name": "John",
    "courses": {
        "MATH101": "A",
        "PHY101": "B",
        "CHEM101": "F"
    },
    "arrears": ["CHEM101"]
}

print("\nNested dict:", json.dumps(student, indent=2))
print("\nAccess nested data:")
print(f"  Name: {student['name']}")
print(f"  Math grade: {student['courses']['MATH101']}")
print(f"  Has arrears: {len(student['arrears']) > 0}")

# List of dictionaries (SUPER COMMON!)
students = [
    {"reg": "AIK24CS001", "name": "John", "score": 85},
    {"reg": "AIK24CS002", "name": "Jane", "score": 92},
    {"reg": "AIK24CS003", "name": "Bob", "score": 78}
]

print("\nList of dictionaries:")
for student in students:
    print(f"  {student['reg']}: {student['name']} scored {student['score']}")