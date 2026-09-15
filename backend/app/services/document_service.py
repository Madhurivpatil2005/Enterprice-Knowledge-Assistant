from fastapi import UploadFile, HTTPException
import os

from app.chunking.text_chunker import chunk_text
from app.models.document_model import create_document
from app.parsers.parser_factory import extract_document_text
from app.uploads.file_storage import save_uploaded_file

from app.repositories.document_repository import (
    create_document as save_document,
    find_document_by_id,
    find_documents_by_user,
    delete_document,
    rename_document,
    search_documents,
    document_exists,
    count_documents,
)

from app.vectorstore.embedding_service import (
    store_chunks,
    delete_document_chunks,
)

from app.vectorstore.chroma_client import collection


# ==================================================
# Upload Document
# ==================================================

def upload_document(
    file: UploadFile,
    current_user: dict,
):

    # Duplicate Check
    existing = document_exists(
        current_user["email"],
        file.filename,
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Document already exists.",
        )

    # Save File
    file_path = save_uploaded_file(file)

    # Extract Text
    text = extract_document_text(file_path)

    # Chunk Text
    chunks = chunk_text(text)

    # Create MongoDB Document
    document = create_document(
        filename=file.filename,
        file_path=file_path,
        user_email=current_user["email"],
    )

    # Save Metadata
    document_id = save_document(document)

    # Store Embeddings
    store_chunks(
        document_id=str(document_id),
        chunks=chunks,
        user_email=current_user["email"],
        filename=file.filename,
    )

    return {
        "document_id": str(document_id),
        "filename": document["filename"],
        "uploaded_at": document["uploaded_at"],
    }


# ==================================================
# Get User Documents
# ==================================================

def get_user_documents(
    current_user: dict,
):

    documents = find_documents_by_user(
        current_user["email"]
    )

    response = []

    for document in documents:
        response.append(
            {
                "document_id": str(document["_id"]),
                "filename": document["filename"],
                "uploaded_at": document["uploaded_at"],
            }
        )

    return response


# ==================================================
# Get Document Details
# ==================================================

def get_document_details(
    document_id: str,
    current_user: dict,
):

    document = find_document_by_id(
        document_id,
        current_user["email"],
    )

    if document is None:
        return None

    return {
        "document_id": str(document["_id"]),
        "filename": document["filename"],
        "file_path": document["file_path"],
        "user_email": document["user_email"],
        "uploaded_at": document["uploaded_at"],
    }


# ==================================================
# Rename Document
# ==================================================

def rename_uploaded_document(
    document_id: str,
    filename: str,
    current_user: dict,
):

    document = find_document_by_id(
        document_id,
        current_user["email"],
    )

    if document is None:
        return None

    updated = rename_document(
        document_id,
        filename,
        current_user["email"],
    )

    if updated is None:
        return None

    return {
        "message": "Document renamed successfully",
        "filename": updated["filename"],
    }


# ==================================================
# Delete Document
# ==================================================

def delete_uploaded_document(
    document_id: str,
    current_user: dict,
):

    document = find_document_by_id(
        document_id,
        current_user["email"],
    )

    if document is None:
        return None

    # Delete Chunks
    delete_document_chunks(
        document_id
    )

    # Delete Local File
    if os.path.exists(
        document["file_path"]
    ):
        os.remove(
            document["file_path"]
        )

    # Delete MongoDB Metadata
    delete_document(
        document_id,
        current_user["email"],
    )

    return {
        "message": "Document deleted successfully"
    }


# ==================================================
# Download Document
# ==================================================

def download_document(
    document_id: str,
    current_user: dict,
):

    document = find_document_by_id(
        document_id,
        current_user["email"],
    )

    if document is None:
        return None

    return document["file_path"]


# ==================================================
# Search Documents
# ==================================================

def search_user_documents(
    filename: str,
    current_user: dict,
):

    documents = search_documents(
        current_user["email"],
        filename,
    )

    response = []

    for document in documents:
        response.append(
            {
                "document_id": str(document["_id"]),
                "filename": document["filename"],
                "uploaded_at": document["uploaded_at"],
            }
        )

    return response


# ==================================================
# Document Statistics
# ==================================================

def get_document_statistics(
    current_user: dict,
):

    total_documents = count_documents(
        current_user["email"]
    )

    documents = find_documents_by_user(
        current_user["email"]
    )

    total_storage = 0

    for document in documents:

        if os.path.exists(
            document["file_path"]
        ):
            total_storage += os.path.getsize(
                document["file_path"]
            )

    results = collection.get(
        where={
            "user_email": current_user["email"]
        }
    )

    total_chunks = len(
        results["ids"]
    )

    storage_mb = round(
        total_storage / (1024 * 1024),
        2,
    )

    return {
        "total_documents": total_documents,
        "total_chunks": total_chunks,
        "storage_used": f"{storage_mb} MB",
    }

