from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from datetime import datetime

print("="*60)
print("PHASE 4: CREATING EXCEL REPORTS")
print("="*60)

# ========================================
# LESSON 1: Excel Structure Basics
# ========================================
print("\nLESSON 1: Understanding Excel Structure")
print("-"*60)
print("""
Excel Hierarchy:
    Workbook (the .xlsx file)
      └── Worksheet (Sheet1, Sheet2, etc.)
            └── Cell (A1, B2, C3, etc.)

Cells are referenced by:
    - Letter + Number: A1, B2, Z99
    - Row/Column index: row=1, column=1 is A1
    
Python equivalents:
    Workbook = Excel file
    Worksheet = Tab/Sheet
    Cell = Single box
""")

# ========================================
# LESSON 2: Creating Your First Excel
# ========================================
print("\n" + "="*60)
print("LESSON 2: Create Your First Excel File")
print("-"*60)

# Step 1: Create a new workbook
wb = Workbook()

# Step 2: Get the active sheet (default sheet)
ws = wb.active
ws.title = "Student Results"  # Rename the sheet

# Step 3: Write data to cells
ws['A1'] = "Register No"
ws['B1'] = "Name"
ws['C1'] = "Score"

# Step 4: Add student data
ws['A2'] = "AIK24CS001"
ws['B2'] = "John"
ws['C2'] = 85

ws['A3'] = "AIK24CS002"
ws['B3'] = "Jane"
ws['C3'] = 92

# Step 5: Save the file
wb.save('my_first_excel.xlsx')
print("✓ Created 'my_first_excel.xlsx'")
print("  Open it and see your data!")

print("\n" + "="*60)
print("LESSON 3: Better Ways to Write Data")
print("-"*60)

# Method 1: Using row/column numbers
wb = Workbook()
ws = wb.active

ws.cell(row=1, column=1, value="Method 1")
ws.cell(row=1, column=2, value="Using cell()")
print("Method 1: ws.cell(row=1, column=1, value='Data')")

# Method 2: Using append (adds new row)
ws.append(["Method 2", "Using append()"])
print("Method 2: ws.append(['Data1', 'Data2'])")

# Method 3: Loop through data
students = [
    ["AIK24CS001", "John", 85],
    ["AIK24CS002", "Jane", 92],
    ["AIK24CS003", "Bob", 78],
]

ws.append(["Register", "Name", "Score"])  # Header
for student in students:
    ws.append(student)

print("Method 3: Loop through list of lists")

wb.save('writing_methods.xlsx')
print("✓ Created 'writing_methods.xlsx'")
