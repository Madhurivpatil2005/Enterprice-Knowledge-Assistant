from sentence_transformers import SentenceTransformer
from app.vectorstore.chroma_client import collection

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(chunks):
    return model.encode(chunks).tolist()


def store_chunks(
    document_id: str,
    chunks: list[str],
    user_email: str,
    filename: str,
):
    print("========== STORE CHUNKS ==========")

    try:
        print("Step 1: Generating embeddings...")
        embeddings = generate_embeddings(chunks)
        print(f"✓ Generated {len(embeddings)} embeddings")

        ids = [
            f"{document_id}_{i}"
            for i in range(len(chunks))
        ]

        metadatas = [
            {
                "document_id": document_id,
                "chunk_number": i,
                "user_email": user_email,
                "filename": filename,
            }
            for i in range(len(chunks))
        ]

        print("Step 2: Adding to ChromaDB...")

        collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
        )

        print("✓ Stored successfully")

    except Exception as e:
        print("\n========== ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("===========================\n")
        raise
def delete_document_chunks(document_id: str):
    """
    Delete all chunks belonging to a document from ChromaDB.
    """

    collection.delete(
        where={
            "document_id": document_id
        }
    )



    