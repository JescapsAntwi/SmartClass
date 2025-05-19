import os
import fitz  # PyMuPDF
import chromadb
from chromadb.utils import embedding_functions
import uuid  # For generating unique IDs for each chunk
import logging

# --- Configuration ---
# IMPORTANT: Create this directory and place your PDF syllabus files inside it.
PDF_DIRECTORY = "./syllabus/"

# ChromaDB will store its data in this directory.
CHROMA_DB_PATH = "./syllabusvectordb"
COLLECTION_NAME = "syllabus_collection"

# Sentence Transformer model for creating embeddings.
# 'all-MiniLM-L6-v2' is a good starting point: fast and decent quality.
# For potentially better (but slower) embeddings, consider models like 'all-mpnet-base-v2'.
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'

# Text chunking parameters (character-based)
CHUNK_SIZE = 1000  # Max characters per chunk
CHUNK_OVERLAP = 150  # Characters to overlap between chunks

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts all text content from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            full_text += page.get_text("text") + "\n"  # Add newline between pages for clarity
        doc.close()
        # Basic cleaning: remove excessive newlines and leading/trailing whitespace
        cleaned_text = ' '.join(full_text.split())
        return cleaned_text
    except Exception as e:
        logging.error(f"Error extracting text from {pdf_path}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, chunk_overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Splits text into overlapping chunks."""
    if not text:
        return []
    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be less than chunk_size.")

    chunks = []
    current_pos = 0
    text_len = len(text)

    while current_pos < text_len:
        end_pos = min(current_pos + chunk_size, text_len)
        chunk = text[current_pos:end_pos]
        chunks.append(chunk)

        if end_pos == text_len:  # Reached the end
            break

        current_pos += (chunk_size - chunk_overlap)
        if current_pos >= text_len: # Ensure we don't go past the end if overlap logic pushes it
            break

    return [c for c in chunks if c.strip()] # Filter out any empty/whitespace-only chunks


def main():
    """Main function to process PDFs and store them in ChromaDB."""
    if not os.path.exists(PDF_DIRECTORY):
        os.makedirs(PDF_DIRECTORY)
        logging.info(f"Created directory {PDF_DIRECTORY}. Please add your PDF syllabus files there and re-run.")
        return

    # 1. Initialize Embedding Function for ChromaDB
    # This allows ChromaDB to generate embeddings automatically when documents are added.
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL_NAME
    )

    # 2. Initialize ChromaDB Client and Collection
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    logging.info(f"ChromaDB client initialized. Data will be stored in {CHROMA_DB_PATH}")

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=sentence_transformer_ef,
        metadata={"hnsw:space": "cosine"}  # Optional: specify distance metric, cosine is common for text
    )
    logging.info(f"Using ChromaDB collection: '{COLLECTION_NAME}'")

    # 3. Process PDF Files
    pdf_files = [os.path.join(PDF_DIRECTORY, f) for f in os.listdir(PDF_DIRECTORY) if f.lower().endswith(".pdf")]

    if not pdf_files:
        logging.warning(f"No PDF files found in {PDF_DIRECTORY}. Please add your syllabus PDFs.")
        return

    logging.info(f"Found {len(pdf_files)} PDF files to process.")

    for pdf_path in pdf_files:
        logging.info(f"Processing {pdf_path}...")
        full_text = extract_text_from_pdf(pdf_path)

        if not full_text:
            logging.warning(f"No text extracted from {pdf_path}, or an error occurred. Skipping.")
            continue

        text_chunks = chunk_text(full_text)
        logging.info(f"  Extracted text and split into {len(text_chunks)} chunks.")

        if not text_chunks:
            logging.warning(f"  No valid chunks generated for {pdf_path}. Skipping.")
            continue

        # Prepare data for ChromaDB batch insertion
        documents_to_add = []
        metadatas_to_add = []
        ids_to_add = []

        for i, chunk in enumerate(text_chunks):
            documents_to_add.append(chunk)
            metadatas_to_add.append({
                "source_pdf": os.path.basename(pdf_path),
                "chunk_number": i + 1,
                "original_length_chars": len(chunk)
            })
            # Generate a unique ID for each chunk to prevent collisions
            ids_to_add.append(f"{os.path.basename(pdf_path).replace('.pdf', '')}_chunk_{i+1}_{uuid.uuid4()}")

        if documents_to_add:
            collection.add(
                documents=documents_to_add,
                metadatas=metadatas_to_add,
                ids=ids_to_add
            )
            logging.info(f"  Added {len(documents_to_add)} chunks to ChromaDB from {os.path.basename(pdf_path)}.")

    logging.info("Finished processing all PDFs.")
    logging.info(f"Total documents in collection '{COLLECTION_NAME}': {collection.count()}")

if __name__ == "__main__":
    main()