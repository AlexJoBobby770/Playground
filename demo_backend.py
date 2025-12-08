from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = {}
task_id_counter = 1

class Task(BaseModel):
    title: str
    description: str

@app.get("/")
def home():
    return {"message": "FastAPI Demo running!", "tasks_count": len(tasks)}

# GET: Fetch all tasks
@app.get("/tasks")
def get_tasks():
    return {"tasks": list(tasks.values())}

# POST: Create a new task
@app.post("/tasks")
def create_task(task: Task):
    global task_id_counter
    new_task = {
        "id": task_id_counter,
        "title": task.title,
        "description": task.description,
        "status": "pending"
    }
    tasks[task_id_counter] = new_task
    task_id_counter += 1
    return {"status": "success", "task": new_task}

# DELETE: Delete a task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if task_id in tasks:
        deleted = tasks.pop(task_id)
        return {"status": "success", "deleted": deleted}
    return {"status": "error", "message": "Task not found"}

# File upload example (for your PDF project later)
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    return {
        "status": "success",
        "filename": file.filename,
        "size": file_size,
        "content_type": file.content_type
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)