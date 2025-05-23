from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.schema import Document
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

from langchain_community.embeddings import DashScopeEmbeddings
# from langchain_community.chat_models.dashscope import ChatDashScope
# from langchain_community.embeddings.dashscope import DashScopeEmbeddings
from langchain.chains import RetrievalQA
import os
import re
import openai
from django.conf import settings

# from langchain.prompts import PromptTemplate

# from query_handlers import get_optimized_query, get_enhanced_prompt
# get API key
# openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.api_base = os.getenv("OPENAI_API_BASE")

# os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["DASHSCOPE_API_KEY"] = os.getenv("DASHSCOPE_API_KEY")

dash_key = os.getenv("DASHSCOPE_API_KEY")

# 1) Embeddings client
# embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
embeddings = DashScopeEmbeddings(model='text-embedding-v3')

persist_dir = os.path.join(settings.BASE_DIR, "chatbot", "vector_database", "chroma_db")
collection_name = "website_vectors"

def get_chroma_client():
    # 2) File-backed Chroma
    # persist_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
    
    chroma = Chroma(
        persist_directory=persist_dir,
        collection_name=collection_name,
        embedding_function=embeddings
    )

    return chroma

# Function loads pdfs from folder
def load_pdfs_from_folder(folder_path: str) -> list[Document]:
    all_docs: list[Document] = []
    for filename in os.listdir(folder_path):
        if not filename.lower().endswith(".pdf"):
            continue

        full_path = os.path.join(folder_path, filename)
        loader = PyMuPDFLoader(full_path)
        docs = loader.load()

        # Derive title from filename, e.g. "My Paper.pdf" -> "My Paper"
        title = os.path.splitext(filename)[0]

        # Add the title meta-field to each Document
        for doc in docs:
            # doc.metadata already contains things like 'source'; we just add 'Title'
            doc.metadata["Title"] = title

        all_docs.extend(docs)

    return all_docs

# cleans string by removing "/n" , extra spaces and line breaks
# def clean_page(text: str) -> str:
#     # Remove artificial newlines that break up sentences or words
#     text = re.sub(r'\n+', ' ', text)             # Merge multiple newlines into one space
#     text = re.sub(r'(?<=\w)-\s+(?=\w)', '', text) # Fix hyphenated line breaks (e.g., "subsi-\ndy" → "subsidy")
#     text = re.sub(r'\s+', ' ', text)             # Normalize extra spaces
#     return text.strip()

# # loop cleaning pipeline through all pdfs
# def clean_documents(docs: list[Document]) -> list[Document]:
#     cleaned_docs = []
#     for doc in docs:
#         cleaned_text = clean_page(doc.page_content)
#         cleaned_docs.append(Document(page_content=cleaned_text, metadata=doc.metadata))
#     return cleaned_docs

# load pdf into vector database
def ingest_pdf(path: str, collection_name: str = "website_vectors"):
    """Load, chunk, embed, and upsert a PDF into Chroma via LangChain."""

    docs = load_pdfs_from_folder(path) # load pdf data
    print("PDF Data Loaded")

    # clean_docs = clean_documents(docs) # clean pdf data
    # print("Data Cleaned")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20
    )
    chunks = splitter.split_documents(docs)
    print("Data Chunked")
    # print(str(chunks[0]))
    print(f"Number of Chunks: {len(chunks)}")

    # load chroma client
    chroma = get_chroma_client()

    chroma.add_documents(chunks)
    print("Data Stored In ChromaDB")

# function to setup query retriever
def get_retriever(chroma_db, collection_name: str = "website_vectors", k: int = 5):
    """Return a Retriever that will fetch the top-k most relevant chunks."""
    return chroma_db.as_retriever(
        search_kwargs={"k": k}#,
        # collection_name=collection_name
    )

# function to setup LLM query chain
def get_qa_chain():
    """Assemble a RetrievalQA chain with GPT-4.1 as the LLM."""
    chroma = get_chroma_client()

    # llm = ChatOpenAI(model="gpt-4.1-nano",temperature=0.0)
    # llm = ChatOpenAI(model="qwen2.5-7b-instruct",openai_api_base='https://dashscope.aliyuncs.com/compatible-mode/v1',api_key=dash_key)
    # llm = ChatOpenAI(model="qwen3-8b",openai_api_base='https://dashscope.aliyuncs.com/compatible-mode/v1',api_key=dash_key,extra_body={"enable_thinking": False})
    llm = ChatOpenAI(model="qwen-turbo-latest",openai_api_base='https://dashscope.aliyuncs.com/compatible-mode/v1',api_key=dash_key,extra_body={"enable_thinking": False})

    retriever = get_retriever(chroma_db=chroma)

    return {'llm':llm,"retriever":retriever}

    # # Updated default prompt template with clear instructions for missing information
    # default_template = """
    # You are a helpful assistant that specializes in explaining Malaysia's diesel subsidy policy.
    # Use the following pieces of retrieved context to answer the user's question.
    
    # If the necessary information to answer the question is not contained in the context below,
    # respond with: "I'm sorry, I don't have that specific information in my knowledge base. 
    # The question you've asked is outside the context of the information available to me. 
    # Please try asking about the diesel subsidy policy details, eligibility criteria, 
    # or implementation timeline."
    
    # Do not make up or infer information that is not directly supported by the context.
    
    # Context: {context}
    
    # Question: {question}
    
    # Answer:
    # """

    # if use_custom_prompt and custom_prompt:
    #     # For custom prompts, return a dictionary with components that can be used
    #     # to construct a personalized chain in ChatAPIView
    #     prompt_template = """
    #     {context}

    #     Question: {question}
    #     """
        
    #     PROMPT = PromptTemplate(
    #         template=prompt_template,
    #         input_variables=["context", "question"]
    #     )
        
    #     # We'll construct the chain in ChatAPIView using these components
    #     return {
    #         "llm": llm,
    #         "retriever": retriever,
    #         "prompt": PROMPT,
    #         "custom_prompt": custom_prompt
    #     }
    # else:
    #     # For normal queries, use a standard RetrievalQA chain
    #     PROMPT = PromptTemplate(
    #         template=default_template,
    #         input_variables=["context", "question"]
    #     )
        
    #     # Return a complete RetrievalQA chain
    #     return RetrievalQA.from_chain_type(
    #         llm=llm,
    #         chain_type="stuff",    # or "map_rerank", "refine" etc.
    #         retriever=retriever,
    #         return_source_documents=True,
    #         chain_type_kwargs={"prompt": PROMPT}
    #     )
