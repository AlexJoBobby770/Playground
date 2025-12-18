from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from datetime import datetime



print("\n" + "="*60)
print("LESSON 4: Making It Look Professional")
print("-"*60)

wb = Workbook()
ws = wb.active
ws.title = "Styled Report"

# Headers
headers = ["Register No", "Name", "Math", "Science", "Total", "Status"]
ws.append(headers)

# Sample data
data = [
    ["AIK24CS001", "John", 85, 90, 175, "PASS"],
    ["AIK24CS002", "Jane", 45, 50, 95, "FAIL"],
    ["AIK24CS003", "Bob", 78, 82, 160, "PASS"],
]

for row in data:
    ws.append(row)

# Style the header row
header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
header_font = Font(bold=True, color="FFFFFF", size=12)

for cell in ws[1]:  # Row 1 (header)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center")

# Color-code the Status column
for row in range(2, ws.max_row + 1):  # Skip header
    status_cell = ws.cell(row=row, column=6)  # Column F (Status)
    
    if status_cell.value == "PASS":
        # Green background for PASS
        status_cell.fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
        status_cell.font = Font(bold=True, color="006100")
    else:
        # Red background for FAIL
        status_cell.fill = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
        status_cell.font = Font(bold=True, color="9C0006")

# Adjust column widths
ws.column_dimensions['A'].width = 15
ws.column_dimensions['B'].width = 12
ws.column_dimensions['C'].width = 8
ws.column_dimensions['D'].width = 10
ws.column_dimensions['E'].width = 8
ws.column_dimensions['F'].width = 10

wb.save('styledreport.xlsx')
print("✓ Created 'styled_report.xlsx'")
print("  Open it - looks professional! 🎨")

