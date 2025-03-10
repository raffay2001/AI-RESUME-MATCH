from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from typing import Optional
from werkzeug.utils import secure_filename
import os
from app.core.security import get_current_user
import uuid
from app.services.resume_parser import ResumeParserService
from app.services.ai_resume_analyzer import AIResumeAnalyzer
from app.helpers.utils import allowed_file, validate_url
from app.db.database import get_database
from datetime import datetime
router = APIRouter()

UPLOAD_FOLDER = 'uploads/resumes'
ALLOWED_EXTENSIONS = {'pdf'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/submit-application")
async def submit_application(
    resume: UploadFile = File(...),
    job_title: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    job_url: Optional[str] = Form(None),
    current_user = Depends(get_current_user)
):
    if not resume.filename or not allowed_file(resume.filename, ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Invalid file format. Only PDF files are allowed") 
    
    if not (job_description or job_url):
        raise HTTPException(status_code=400, detail="Either job description or job URL is required")
    
    if job_url and not validate_url(job_url):
        raise HTTPException(status_code=400, detail="Invalid job URL")
    
    user_upload_dir = os.path.join(UPLOAD_FOLDER, str(current_user.get('id')))
    os.makedirs(user_upload_dir, exist_ok=True)

    filename = secure_filename(resume.filename)
    file_path = os.path.join(user_upload_dir, f"{uuid.uuid4()}_{filename}")
    
    content = await resume.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    parsed_text = ResumeParserService.parse_pdf(file_path)
    if parsed_text is None:
        raise HTTPException(status_code=500, detail="Failed to parse resume")
    
    analyzer = AIResumeAnalyzer()
    fit_score, insights = analyzer.analyze_resume(
        resume_text=parsed_text,
        job_url=job_url,
        job_title=job_title,
        job_description=job_description
    )
    
    # Save application data to MongoDB
    db = get_database()
    application_data = {
        "user_id": current_user.get('id'),
        "job_title": job_title,
        "job_url": job_url,
        "job_description": job_description,
        "resume_file_path": file_path,
        "fit_score": fit_score,
        "insights": insights,
        "created_at": datetime.now()
    }
    
    # Insert into applications collection
    result = db.applications.insert_one(application_data)
    
    return {
        "message": "Application submitted successfully",
        "data": {
            "fit_score": fit_score,
            "insights": insights,
        }
    } 