from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
from pdfminer.high_level import extract_text
from sentence_transformers import SentenceTransformer, util
import torch

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the AI model (happens once when server starts)
print("Loading AI model...")
model = SentenceTransformer('all-MiniLM-L6-v2')  # Small, fast model
print("Model loaded!")

# Store answer key in memory (in real app, use database)
answer_key = {}

class ScoreResult(BaseModel):
    filename: str
    similarity_score: float
    percentage: float
    extracted_text: str
    answer_key_text: str
    grade: str

@app.get("/")
def home():
    return {
        "message": "Auto Grader API running!",
        "has_answer_key": len(answer_key) > 0
    }

@app.post("/upload-answer-key")
async def upload_answer_key(file: UploadFile = File(...)):
    """
    Upload the answer key PDF
    This is what student answers will be compared against
    """
    try:
        # Extract text from PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
            text = extract_text(tmp_path)
        
        # Store the answer key
        answer_key['text'] = text.strip()
        answer_key['filename'] = file.filename
        
        return {
            "status": "success",
            "message": "Answer key uploaded successfully",
            "filename": file.filename,
            "text_preview": text[:200] + "..." if len(text) > 200 else text
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error processing answer key: {str(e)}"
        }

@app.post("/grade-submission")
async def grade_submission(file: UploadFile = File(...)):
    """
    Upload a student submission PDF and get it graded
    """
    try:
        # Check if answer key exists
        if 'text' not in answer_key:
            return {
                "status": "error",
                "message": "Please upload answer key first!"
            }
        
        # Extract text from student submission
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
            student_text = extract_text(tmp_path).strip()
        
        if not student_text:
            return {
                "status": "error",
                "message": "Could not extract text from PDF"
            }
        
        # AI SCORING HAPPENS HERE!
        # Convert both texts to embeddings (numerical representations)
        answer_embedding = model.encode(answer_key['text'], convert_to_tensor=True)
        student_embedding = model.encode(student_text, convert_to_tensor=True)
        
        # Calculate similarity (0 to 1, where 1 is identical)
        similarity = util.pytorch_cos_sim(answer_embedding, student_embedding)
        similarity_score = float(similarity[0][0])
        
        # Convert to percentage
        percentage = round(similarity_score * 100, 2)
        
        # Assign grade based on percentage
        if percentage >= 90:
            grade = "A"
        elif percentage >= 80:
            grade = "B"
        elif percentage >= 70:
            grade = "C"
        elif percentage >= 60:
            grade = "D"
        else:
            grade = "F"
        
        return {
            "status": "success",
            "filename": file.filename,
            "similarity_score": similarity_score,
            "percentage": percentage,
            "grade": grade,
            "student_text": student_text[:300] + "..." if len(student_text) > 300 else student_text,
            "answer_key_text": answer_key['text'][:300] + "..." if len(answer_key['text']) > 300 else answer_key['text']
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error grading submission: {str(e)}"
        }

@app.get("/answer-key-status")
def get_answer_key_status():
    """Check if answer key is uploaded"""
    if 'text' in answer_key:
        return {
            "uploaded": True,
            "filename": answer_key['filename'],
            "text_length": len(answer_key['text'])
        }
    return {"uploaded": False}

@app.delete("/clear-answer-key")
def clear_answer_key():
    """Clear the current answer key"""
    global answer_key
    answer_key = {}
    return {"status": "success", "message": "Answer key cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)