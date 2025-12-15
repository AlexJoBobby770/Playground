import PyPDF2

pdf_path=r'C:\Users\alexj\Downloads\result_AIK S4 APRIL 2025- additional list.pdf'

try:

    with open(pdf_path, 'rb') as file:

        reader = PyPDF2.PdfReader(file)

        num_pages = len(reader.pages)
        print(f"✓ PDF opened successfully!")
        print(f"  Total pages: {num_pages}")

        metadata = reader.metadata
        if metadata:
            print(f"\n📋 Metadata:")
            print(f"  Title: {metadata.get('/Title', 'N/A')}")
            print(f"  Author: {metadata.get('/Author', 'N/A')}")
            print(f"  Creator: {metadata.get('/Creator', 'N/A')}")

        print("-" * 60)
        for line in range(len(reader.pages)):
            first_page = reader.pages[line]
            text = first_page.extract_text()
            all_text+=text
            print(all_text) 
            print("...")
        
except FileNotFoundError:
    print(f"❌ Error: Could not find '{pdf_path}'")
    print("Make sure the PDF is in the same folder as this script!")
except Exception as e:
    print(f"❌ Error: {e}")

