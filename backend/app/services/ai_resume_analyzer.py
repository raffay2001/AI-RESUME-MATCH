from typing import Tuple
from app.clients.AnthropicClient import AnthropicClient
from app.services.job_scraper import JobScraper

class AIResumeAnalyzer:
    def __init__(self):
        self.client = AnthropicClient()
        self.job_scraper = JobScraper()

    def analyze_resume(self, resume_text: str, job_url: str, job_title: str, job_description: str) -> Tuple[int, list[str]]:
        """
        Analyzes resume against job requirements and returns fit score and insights
        
        Args:
            resume_text (str): Parsed resume text
            job_title (str): Title of the job
            job_description (str): Full job description
            
        Returns:
            Tuple containing:
            - fit_score (int): 0-100 score indicating candidate fit
            - insights (list[str]): List of actionable recommendations
        """

        if job_url:
            print(f"Scraping job details from URL: {job_url}")
            job_details = self.job_scraper.extract_job_data(job_url)
            print(f"Job details scraped successfully: {job_details}")
        else:
            print("Using job description provided from the user")
            job_details = {
                "job_title": job_title,
                "job_description": job_description
            }
        
        
        prompt = """You are an expert HR professional and career coach. Analyze this candidate's resume against the job details.

                Resume:
                {resume_text}

                Job Details:
                {job_details}

                Provide a fit score from 0-100 based on how well the candidate's experience matches the job requirements, and 4-6 specific, actionable recommendations for improving their application.

                Metrics for calculating the fit score:
                - See the experience and education of the candidate and the job details and compare them.
                - See the skills of the candidate and the job details and compare them.
                - See the certifications of the candidate and the job details and compare them.
                - See the projects of the candidate and the job details and compare them.
                - See the publications of the candidate and the job details and compare them.
                - See the awards of the candidate and the job details and compare them.

                Return your response as a JSON string in exactly this format:
                {{
                    "score": <number between 0-100>,
                    "insights": [
                        "insight 1",
                        "insight 2",
                        "insight 3",
                        ...
                    ]
                }}
                
                If any field is not explicitly available in the content, make a reasonable inference based on context or leave as an empty string or empty list as appropriate.
                
                Return ONLY a valid JSON object with no additional text, comments, or explanations.
                """
        
        variables = {
            "resume_text": resume_text,
            "job_details": job_details
        }

        response = self.client.chat(prompt, variables)
        
        try:
            import json
            result = json.loads(response)
            return result["score"], result["insights"]
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error parsing response: {e}")
            print(f"Raw response: {response}")
            raise ValueError("Failed to parse AI response into the expected format") 