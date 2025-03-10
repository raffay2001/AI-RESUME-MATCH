from langchain_anthropic import ChatAnthropic
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

class AnthropicClient:
    def __init__(self):
        print("Initializing Anthropic client")
        self.client = ChatAnthropic(api_key=settings.ANTHROPIC_API_KEY, model="claude-3-7-sonnet-20250219")
        
    def chat(self, prompt: str, variables: dict = None) -> str:
        print("Chatting with Anthropic")
        prompt_template = PromptTemplate(template=prompt, input_variables=list(variables.keys()))
        chain = prompt_template | self.client | StrOutputParser()
        response = chain.invoke(variables)
        if hasattr(response, 'content'):
            print("Response has content")
            response_text = response.content
        else:
            print("Response does not have content")
            response_text = str(response)
        print("Response text: ", response_text)
        return response_text
    

