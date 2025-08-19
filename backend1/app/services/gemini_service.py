import os
from statistics import mode
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

# Ensure both GEMINI_API_KEY and GOOGLE_API_KEY are set for compatibility
api_key = os.getenv("GEMINI_API_KEY")
google_api_key = os.getenv("GOOGLE_API_KEY")
creds_file = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if api_key:
    os.environ["GEMINI_API_KEY"] = api_key
if google_api_key:
    os.environ["GOOGLE_API_KEY"] = google_api_key
elif creds_file and os.path.exists(creds_file):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_file
elif not api_key and not google_api_key:
    raise ValueError("Either GEMINI_API_KEY or GOOGLE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS must be set.")
model_name = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash")

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks


def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")


def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGoogleGenerativeAI(model=model_name, temperature=0.7)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain


def update_faiss_index(pdf_paths):
    text = get_pdf_text(pdf_paths)
    chunks = get_text_chunks(text)
    get_vector_store(chunks)



def answer_question(question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)
    summary = response.get("output_text", "No summary returned.")
    relevant_sections = [doc.page_content for doc in docs]
    return {
        "summary": summary,
        "relevant_sections": relevant_sections
    }
