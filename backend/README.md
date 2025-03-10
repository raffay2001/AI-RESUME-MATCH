# Resume Job Matcher API

A FastAPI application for matching resumes with job descriptions using AI-powered analysis.

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Set up environment variables in `.env` file:
   ```
   API_PORT=8000
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DB_NAME=resume_matcher
   SECRET_KEY=your-secret-key
   ALGORITHM=RS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_MINUTES=10080
   JWT_PRIVATE_KEY=your-private-key
   JWT_PUBLIC_KEY=your-public-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   CLIENT_ORIGIN=http://localhost:3000
   ```
6. Run the application:
   ```
   uvicorn app.main:app --reload
   ```

## API Documentation

### Authentication Endpoints

#### POST /api/v1/auth/signup
Create a new user account
- Request Body:
  ```json
  {
    "name": "string",
    "email": "user@example.com",
    "password": "string"
  }
  ```

#### POST /api/v1/auth/login
Login and get access token
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```

### Job Application Endpoints

#### POST /api/v1/jobs/submit-application
Submit resume for job matching
- Request Body (multipart/form-data):
  - resume: PDF file
  - job_title: string (optional)
  - job_description: string (optional)
  - job_url: string (optional)
- Response:
  ```json
  {
    "message": "Application submitted successfully",
    "data": {
      "fit_score": 85,
      "insights": [
        "Strong technical skill match",
        "Consider highlighting project management experience",
        "Add more quantitative achievements"
      ]
    }
  }
  ```

### Base Endpoints

#### GET /api/v1/base/health
Health check endpoint
- Response:
  ```json
  {
    "status": "healthy",
    "api_version": "v1",
    "service": "Resume Job Matcher API"
  }
  ```

## Architecture

### Service Layer

The application follows a service-based architecture where business logic is encapsulated in dedicated services:

1. **BaseService**: Generic CRUD operations for MongoDB collections
2. **AIResumeAnalyzer**: Handles resume analysis using Claude AI
3. **ResumeParser**: PDF parsing and text extraction
4. **JobScraper**: Web scraping for job postings

### AI Integration

The application uses Claude 3 Sonnet through the AnthropicClient for:
- Resume analysis against job requirements
- Extracting structured data from job postings
- Generating personalized insights and recommendations

### Security

- JWT-based authentication with public/private key signing
- Refresh token mechanism for extended sessions
- Password hashing using bcrypt
- CORS protection with configurable origins

## API Documentation Access

Once the application is running, access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc


## Project Structure
```
resume-job-matcher/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Application entry point
│   ├── api/                       # API endpoints
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py           # Authentication routes
│   │       ├── base.py           # Health check routes
│   │       └── jobs.py           # Job matching routes
│   ├── clients/                   # External service clients
│   │   └── AnthropicClient.py    # Claude AI client
│   ├── core/                      # Core functionality
│   │   ├── config.py             # Configuration settings
│   │   └── security.py           # JWT & authentication
│   ├── db/                        # Database
│   │   └── database.py           # MongoDB connection
│   ├── helpers/                   # Helper functions
│   │   └── utils.py              # Utility functions
│   ├── models/                    # Database models
│   │   ├── base.py               # Base model
│   │   └── user.py               # User model
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── base.py               # Base schemas
│   │   └── user.py               # User schemas
│   └── services/                  # Business logic
│       ├── __init__.py
│       ├── ai_resume_analyzer.py  # Resume analysis
│       ├── base.py               # Base service
│       ├── job_scraper.py        # Job scraping
│       └── resume_parser.py       # PDF parsing
├── tests/                         # Test files
│   └── __init__.py
├── uploads/                       # File uploads
│   └── resumes/                  # Uploaded resumes
├── .env                          # Environment variables
├── .gitignore
├── requirements.txt              # Project dependencies
└── README.md                    # Project documentation
``` 

## License

MIT License
