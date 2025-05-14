from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.schema import Document
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
import os
import re
import openai

# get API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# 1) Embeddings client (GPT-4.1 uses the same endpoint as GPT-4, just set model name)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 2) File-backed Chroma
persist_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
collection_name = "website_vectors"
chroma = Chroma(
    persist_directory=persist_dir,
    collection_name=collection_name,
    embedding_function=embeddings
)

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
def clean_page(text: str) -> str:
    # Remove artificial newlines that break up sentences or words
    text = re.sub(r'\n+', ' ', text)             # Merge multiple newlines into one space
    text = re.sub(r'(?<=\w)-\s+(?=\w)', '', text) # Fix hyphenated line breaks (e.g., "subsi-\ndy" → "subsidy")
    text = re.sub(r'\s+', ' ', text)             # Normalize extra spaces
    return text.strip()

# loop cleaning pipeline through all pdfs
def clean_documents(docs: list[Document]) -> list[Document]:
    cleaned_docs = []
    for doc in docs:
        cleaned_text = clean_page(doc.page_content)
        cleaned_docs.append(Document(page_content=cleaned_text, metadata=doc.metadata))
    return cleaned_docs

# load pdf into vector database
def ingest_pdf(path: str, collection_name: str = "website_vectors"):
    """Load, chunk, embed, and upsert a PDF into Chroma via LangChain."""

    docs = load_pdfs_from_folder(path) # load pdf data
    print("PDF Data Loaded")

    # clean_docs = clean_documents(docs) # clean pdf data
    # print("Data Cleaned")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(docs)
    print("Data Chunked")

    chroma.add_documents(chunks)
    print("Data Stored In ChromaDB")

# function to setup query retriever
def get_retriever(collection_name: str = "website_vectors", k: int = 5):
    """Return a Retriever that will fetch the top-k most relevant chunks."""
    return chroma.as_retriever(
        search_kwargs={"k": k}#,
        # collection_name=collection_name
    )

# function to setup LLM query chain
def get_qa_chain():
    """Assemble a RetrievalQA chain with GPT-4.1 as the LLM."""
    llm = ChatOpenAI(
        model="gpt-4.1-nano",
        temperature=0.0
    )
    retriever = get_retriever()
    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",    # or "map_rerank", "refine" etc.
        retriever=retriever,
        return_source_documents=True
    )
