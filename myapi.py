from fastapi import FastAPI,Path,UploadFile
from typing import Optional
from pydantic import BaseModel

app=FastAPI()
student={
    1:{
        "name":"alex",
        "age":20,
        "sex":"m"
    }
}

class Student(BaseModel):
    name:str
    age:int
    sex:str

class UpdateStudent(BaseModel):
    name:Optional[str]
    age:Optional[int]
    sex:Optional[str]


@app.get("/")
def index():
    return {"name":"first data"}

@app.get("/get-student/{student_id}")
def get_student(student_id: int= Path ( description="id of student u want to see",gt=0,lt=5)):
    return student[student_id]

@app.get("/by-name")
def get_by_name(*,name:Optional[str]=None,test:int):
    for student_id in student:
        if student[student_id]["name"] == name:
            return student[student_id]
    return {"data":"not found"}

@app.post("/create-student/{student_id}")
def create_student(student_id:int,new_student:Student):
    if student_id in student:
        return {"data":"exists"}
    student[student_id]=new_student
    return student[student_id]

@app.put("/update_student/{student_id}")
def update(student_id:int ,student :UpdateStudent):
    if student_id not in student:
        return {"error": "student does not exists"}
    
    student[student_id]=UpdateStudent
    return student[student_id]
@app.post("/upload")
async def file_upload(uploaded_file:UploadFile):
    data=await uploaded_file.read()
    print(data)
    

    