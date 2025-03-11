# AI Resume Match Application

An AI-powered application that evaluates and matches user resumes against specific job postings, providing a fit score and actionable insights to enhance job application success.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [AI Integration](#ai-integration)
- [Local Development Setup](#local-development-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [Future Extensions](#future-extensions)
- [License](#license)

## Features

- **Resume Analysis**: Upload resumes and receive a fit score (0-100) based on job requirements.
- **Job Posting Scraping**: Extract job details from provided URLs using Selenium.
- **AI-Powered Insights**: Utilize Claude Sonnet 3.7 LLM for in-depth resume evaluation.
- **User Authentication**: Secure user registration and login system.

## Tech Stack

### Backend

- **Framework**: FastAPI
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Web Scraping**: Selenium

### Frontend

- **Library**: React with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn
- **Build Tool**: Vite

### AI Integration

- **Language Model**: Claude Sonnet 3.7 via Langchain

## Local Development Setup

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/raffay2001/AI-RESUME-MATCH.git
   cd AI-RESUME-MATCH/backend
   ```
2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   ```
3. **Activate the Virtual Environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```
4. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Set Up Environment Variables**:
   - Copy the example environment file and modify as needed:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with appropriate values (e.g., database connection, API keys).
6. **Run the Application**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd ../frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
4. **Access the Frontend**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Docker Setup

To containerize both the backend and frontend applications:

1. **Ensure Docker and Docker Compose are Installed**:
   - Verify installation by running:
     ```bash
     docker --version
     docker compose --version
     ```
2. **Set Up Environment Variables**:
   - Copy the example environment file for the backend:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update `.env` with appropriate values.
3. **Build and Start the Containers**:
   - From the project root directory, execute:
     ```bash
     docker compose up --build
     ```
4. **Access the Application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**:
     - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
     - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
5. **Stop the Containers**:
   ```bash
   docker compose down
   ```
6. **View Logs**:
   ```bash
   docker compose logs -f
   ```

## Project Structure

```
AI-RESUME-MATCH/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # Application entry point
│   │   ├── api/                       # API endpoints
│   │   │   ├── __init__.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py            # Authentication routes
│   │   │       ├── base.py            # Health check routes
│   │   │       └── jobs.py            # Job matching routes
│   │   ├── clients/                   # External service clients
│   │   │   └── AnthropicClient.py     # Claude AI client
│   │   ├── core/                      # Core functionality
│   │   │   ├── config.py              # Configuration settings
│   │   │   └── security.py            # JWT & authentication
│   │   ├── db/                        # Database
│   │   │   └── database.py            # MongoDB connection
│   │   ├── helpers/                   # Helper functions
│   │   │   └── utils.py               # Utility functions
│   │   ├── models/                    # Database models
│   │   │   ├── base.py                # Base model
│   │   │   └── user.py                # User model
│   │   ├── schemas/                   # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── base.py                # Base schemas
│   │   │   └── user.py                # User schemas
│   │   └── services/                  # Business logic
│   │       ├── __init__.py
│   │       ├── ai_resume_analyzer.py  # Resume analysis
│   │       ├── base.py                # Base service
│   │       ├── job_scraper.py         # Job scraping
│   │       └── resume_parser.py       # PDF parsing
 