from datetime import datetime

from pydantic import BaseModel


# ---------------- Upload Response ----------------

class DocumentResponse(BaseModel):
    document_id: str
    filename: str
    uploaded_at: datetime


# ---------------- Document Details ----------------

class DocumentDetailsResponse(BaseModel):
    document_id: str
    filename: str
    file_path: str
    user_email: str
    uploaded_at: datetime


# ---------------- Rename Request ----------------

class RenameDocumentRequest(BaseModel):
    filename: str


# ---------------- Rename Response ----------------

class RenameDocumentResponse(BaseModel):
    message: str
    filename: str


# ---------------- Search Response ----------------

class SearchDocumentResponse(BaseModel):
    document_id: str
    filename: str
    uploaded_at: datetime


# ---------------- Statistics Response ----------------

class DocumentStatisticsResponse(BaseModel):
    total_documents: int
    total_chunks: int
    storage_used: str