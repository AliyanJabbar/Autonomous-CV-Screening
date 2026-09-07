from dotenv import load_dotenv
import os
from agents import AsyncOpenAI, OpenAIChatCompletionsModel, RunConfig


load_dotenv()

# ------------------------------ Groq Config (Default) ------------------------------ 

groq_key = os.getenv("GROQ_API_KEY")

if groq_key:
    groq_client = AsyncOpenAI(
        api_key=groq_key,
        base_url="https://api.groq.com/openai/v1",
    )

    groq_model = OpenAIChatCompletionsModel(
        model="openai/gpt-oss-20b", 
        openai_client=groq_client
    )

    groq_config = RunConfig(
        model=groq_model,
        model_provider=groq_client
    )
else:
    groq_client = None
    groq_model = None
    groq_config = None
