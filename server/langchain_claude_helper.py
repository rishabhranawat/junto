from langchain.chat_models import ChatAnthropic
from dotenv import load_dotenv
import os
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import AIMessage, HumanMessage, SystemMessage

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

chat = ChatAnthropic()

messages = [
    HumanMessage(
        content="Translate this sentence from English to French. I love programming."
    )
]
print(chat(messages))
