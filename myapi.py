from fastapi import FastAPI,Path

app=FastAPI()
student={
    1:{
        "name":"alex",
        "age":20,
        "sex":"m"
    }
}

@app.get("/")
def index():
    return {"name":"first data"}

@app.get("/get-student/{student_id}")
def get_student(student_id: int= Path ( description="id of student u want to see")):
    return student[student_id]