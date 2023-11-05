import rag

from langchain.chat_models import ChatAnthropic
from dotenv import load_dotenv
import os
from rag import construct_context_for_junto

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


def chat_with_anthropic(topic, context, speaker, prev_speaker_arguments):
    non_speaker = "Sam Altman" if speaker == "Elon Musk" else "Sam Altman"
    system_context = "This is a debate between Elon Musk and Sam Altman. Context: {} and {}'s previous arguments are: {}.".format(context, non_speaker, " ".join(prev_speaker_arguments))
    # print('system_context>>>>>>>>', system_context)
    messages = [
        SystemMessage(
            content=system_context
        ),
        HumanMessage(
            content="""
            fill out speech for {speaker} to speak. 
            Remember your response will be direclty spoken by {speaker}. So do not be verbose"""
        )
    ]
    print(type(chat(messages)))
    print(chat(messages))


context = """
Joe Biden Issues Executive Order To Place More Guardrails Around AI AI companies will be required to share their safety test results with the U.S. government as part of President Biden’s new executive order, designed to mitigate the risks of the emerging technology. The White House unveiled a series of steps that Biden is tak… AI companies will be required to share their safety test results with the U.S. government as part of President Biden’s new executive order, designed to mitigate the risks of the emerging technology
"""
topic = "AI Safety"
speaker = "Elon Musk"
prev_speaker_arguments = [
    "I think we should use closed source models and do those in a safe way."]
chat_with_anthropic(topic, context, speaker, prev_speaker_arguments)
