from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from datetime import datetime

print("\n" + "="*60)
print("LESSON 6: Adding Excel Formulas")
print("-"*60)

wb = Workbook()
ws = wb.active
ws.title = "Calculations"

# Headers
ws.append(["Name", "Math", "Science", "Total", "Average", "Grade"])

# Data
students = [
    ["John", 85, 90],
    ["Jane", 78, 82],
    ["Bob", 92, 88],
]

for i, student in enumerate(students, start=2):  # Start from row 2
    ws[f'A{i}'] = student[0]
    ws[f'B{i}'] = student[1]
    ws[f'C{i}'] = student[2]
    
    # Formula for Total (Math + Science)
    ws[f'D{i}'] = f'=B{i}+C{i}'
    
    # Formula for Average
    ws[f'E{i}'] = f'=D{i}/2'
    
    # Formula for Grade (IF statement)
    ws[f'F{i}'] = f'=IF(E{i}>=80,"A",IF(E{i}>=60,"B","C"))'

# Add totals at bottom
last_row = ws.max_row + 1
ws[f'A{last_row}'] = "TOTAL"
ws[f'B{last_row}'] = f'=SUM(B2:B{last_row-1})'
ws[f'C{last_row}'] = f'=SUM(C2:C{last_row-1})'

# Bold the totals row
for cell in ws[last_row]:
    cell.font = Font(bold=True)

wb.save('with_formulas.xlsx')
print("✓ Created 'with_formulas.xlsx'")
print("  Open it and see the calculations work!")
