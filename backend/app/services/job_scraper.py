import json
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
import time
from app.clients.AnthropicClient import AnthropicClient

class JobScraper:
    def __init__(self):
        self.client = AnthropicClient()

    def scrape_webpage_with_selenium(self, url):
        """Scrape content from a given URL using Selenium."""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")  
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
            
            driver = webdriver.Chrome(options=chrome_options)
            
            driver.get(url)
            
            time.sleep(5)
            
            html_content = driver.page_source
            
            driver.quit()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            for script in soup(["script", "style"]):
                script.extract()
            
            text = soup.get_text(separator='\n')
            
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            return text
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return None

    def extract_job_data(self, url):
        content = self.scrape_webpage_with_selenium(url)
        
        """Extract structured job data using Anthropic API."""
        prompt = """
            You are an expert job data extractor. Below is the content from a job posting webpage.
            
            Extract the following information in a structured format according to this schema:
        {{
            "company_name": string,
            "job_title": string,
            "job_description": string,
            "relevant_skills": [list of strings],
            "relevant_experience": string,
            "responsibilities": [list of strings],
            "requirements": [list of strings] 
        }}
        
        If any field is not explicitly available in the content, make a reasonable inference based on context or leave as an empty string or empty list as appropriate.
        
        Return ONLY a valid JSON object with no additional text, comments, or explanations.
        
        Job posting content:
        {content}
        """

        variables = {
            "content": content
        }
        
        response = self.client.chat(prompt, variables)

        try:
            json_str = response[response.find('{'):response.rfind('}')+1]
            job_data = json.loads(json_str)
            return job_data
        except json.JSONDecodeError:
            print("Failed to parse JSON from model response")
            print("Response:", response)
            return None

