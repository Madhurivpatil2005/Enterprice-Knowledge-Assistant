from sentence_transformers import SentenceTransformer

from app.vectorstore.chroma_client import collection


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def search_documents(
    question: str,
    user_email: str,
    top_k: int = 5,
    filename: str | None = None,
    file_type: str | None = None,
):

    question_embedding = model.encode(
        question
    ).tolist()

    # ------------------------------------------
    # Build filters
    # ------------------------------------------

    conditions = [
        {
            "user_email": user_email
        }
    ]

    if filename:
        conditions.append(
            {
                "filename": filename
            }
        )

    # ------------------------------------------
    # Semantic search
    # ------------------------------------------

    if len(conditions) == 1:

        where_filter = {
            "user_email": user_email
        }

    else:

        where_filter = {
            "$and": conditions
        }

    results = collection.query(
        query_embeddings=[
            question_embedding
        ],
        n_results=top_k,
        where=where_filter,
    )

    if not results.get("documents"):
        return []

    documents = results["documents"][0]

    metadatas = results.get(
        "metadatas",
        [[]]
    )[0]

    response = []

    for index, chunk in enumerate(documents):

        metadata = {}

        if index < len(metadatas):
            metadata = metadatas[index] or {}

        # --------------------------------------
        # File type filtering
        # --------------------------------------

        if file_type:

            current_filename = metadata.get(
                "filename",
                ""
            )

            if not current_filename.lower().endswith(
                file_type.lower()
            ):
                continue

        response.append(
            {
                "text": chunk,
                "filename": metadata.get(
                    "filename",
                    "Unknown",
                ),
                "chunk_number": metadata.get(
                    "chunk_number",
                    0,
                ),
                "document_id": metadata.get(
                    "document_id",
                    "",
                ),
            }
        )

    return response