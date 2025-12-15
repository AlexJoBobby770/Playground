import PyPDF2

pdf_path=r'C:\Users\alexj\Downloads\result_AIK S4 APRIL 2025- additional list.pdf'

print("\n" + "="*60)
print("LESSON 5: Getting Lines that Match a Pattern")
print("="*60)

def extract_lines_with_keyword(pdf_path, keyword):
    """Extract all lines containing a specific keyword"""
    matching_lines = []
    
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        
        for page in reader.pages:
            text = page.extract_text()
            lines = text.split('\n')
            
            for line in lines:
                if keyword in line:
                    matching_lines.append(line.strip())
    
    return matching_lines

try:
    print("\n📋 Finding all lines with student register numbers (AIK24):\n")
    student_lines = extract_lines_with_keyword(pdf_path, "AIK24")
    
    print(f"Found {len(student_lines)} lines:")
    # Print first 10 lines as sample
    for i, line in enumerate(student_lines[:10]):
        print(f"  {i+1}. {line}")
    
    if len(student_lines) > 10:
        print(f"  ... and {len(student_lines) - 10} more lines")
        
except Exception as e:
    print(f"❌ Error: {e}")
