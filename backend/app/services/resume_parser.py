from pypdf import PdfReader
from typing import Optional

class ResumeParserService:
    @staticmethod
    def parse_pdf(file_path: str) -> Optional[str]:
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            text_file_path = file_path.rsplit('.', 1)[0] + '.txt'
            with open(text_file_path, 'w', encoding='utf-8') as f:
                f.write(text.strip())
            
            return text.strip()
        except Exception as e:
            print(f"Error parsing PDF: {str(e)}")
            return None 