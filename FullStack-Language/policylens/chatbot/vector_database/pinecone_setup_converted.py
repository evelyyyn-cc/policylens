# %% [markdown]
# ## Video Referrence
# - [Complete Tutorial on Vector Database - Learn ChromaDB, Pinecone & Weaviate | Generative AI](https://www.youtube.com/watch?v=8KrTO9bS91s)
# - https://github.com/entbappy/Complete-Generative-AI-Course-on-YouTube/blob/main/Vector%20Database/2.Pinecone_demo.ipynb
# 

# %% [markdown]
# ## Import All the Required Libraries

# %%
from langchain.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
from langchain.document_loaders import PyMuPDFLoader
from langchain.document_loaders import DirectoryLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.vectorstores import Pinecone
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import os

# %%
from dotenv import load_dotenv

load_dotenv()

openAi_key = os.getenv('OPENAI_API_KEY')
pinecone_key = os.getenv('PINECONE_API_KEY')

# %% [markdown]
# ## Extract the Text from the PDF's

# %%
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


# ✅ Load all PDFs in the folder
data = load_pdfs_from_folder("website_content/")

# %%
# loader = PyPDFDirectoryLoader("website_content")
# # loader = PyPDFLoader("Website_Report_V1.pdf")
# data = loader.load()

# %%
data

# %% [markdown]
# ## Clean Data

# %%
import re

def clean_page(text: str) -> str:
    # Remove zero-width space characters
    text = text.replace('\u200b', '')
    
    # Remove artificial newlines that break up sentences or words
    text = re.sub(r'\n+', ' ', text)             # Merge multiple newlines into one space
    text = re.sub(r'(?<=\w)-\s+(?=\w)', '', text) # Fix hyphenated line breaks (e.g., "subsi-\ndy" → "subsidy")
    text = re.sub(r'\s+', ' ', text)             # Normalize extra spaces
    return text.strip()

def clean_documents(docs: list[Document]) -> list[Document]:
    cleaned_docs = []
    for doc in docs:
        cleaned_text = clean_page(doc.page_content)
        cleaned_docs.append(Document(page_content=cleaned_text, metadata=doc.metadata))
    return cleaned_docs


# %%
clean_data = clean_documents(data)
print(clean_data)

# %%
print(clean_data[0])

# %% [markdown]
# ## Split the Extracted Data into Text Chunks

# %%
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
text_chunks = text_splitter.split_documents(clean_data)

# %%
print(len(text_chunks))
text_chunks[0]

# %% [markdown]
# ## Load OPENAI API

# %%
# os.environ['OPENAI_API_KEY'] = 

# %% [markdown]
# ## Download the Embeddings

# %%
# Use a specific embedding model
embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")

# %%
# text = "LangChain is an AI framework for LLMs."
# vector = embeddings_model.embed_query(text)

# print(len(vector))
# print(vector[:5])  # Print first 5 values for readability


# %% [markdown]
# ## Initializing the Pinecone

# %%
# pc = pinecone.Pinecone(pinecone_key)
index_name = "fit5120-tm01"
# index = pc.Index(index_name)

# %% [markdown]
# ## Create Embeddings for each of the Text Chunk

# %%
# # Pinecone.from_texts() vs Pinecone.from_documents()
# # .from_documents() stores meta data while .from_texts() does not

# docsearch = Pinecone.from_texts([t.page_content for t in text_chunks], embeddings_model, index_name=index_name)

# %% [markdown]
# ## If you already have an index, you can load it like this

# %%
docsearch = Pinecone.from_existing_index(index_name, embeddings_model)
docsearch

# %% [markdown]
# ## Similarity Search

# %%
query = "How much is the diesel subisdy expenditure in 2024"

docs = docsearch.similarity_search(query, k=3)

# %%
docs

# %% [markdown]
# ## Creating a LLM Model Wrapper

# %%
llm_gpt4 = ChatOpenAI(model="gpt-4.1-nano") #gpt-4.1-mini

qa = RetrievalQA.from_chain_type(llm=llm_gpt4, chain_type="stuff", retriever=docsearch.as_retriever(search_kwargs={"k": 3}))

# %%
qa

# %% [markdown]
# ## Q/A

# %%
query = "How much was the government expenditure?"
qa.invoke(query)

# %%
query = "How much is the diesel subisdy expenditure in 2024"
qa.invoke(query)

# %%
query = "How much is the diesel subsidy expenditure in 2024"
qa.invoke(query)

# %%
while True:
  user_input = input(f"Input Prompt: ")
  if user_input == 'exit':
    print('Exiting')
    break
  if user_input == '':
    continue
  result = qa.invoke({'query': user_input})
  print(f"Answer: {result['result']}")
     


