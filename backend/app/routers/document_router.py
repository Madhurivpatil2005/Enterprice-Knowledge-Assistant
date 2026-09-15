from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    HTTPException,
)
from fastapi.responses import FileResponse

from app.auth.dependencies import get_current_user

from app.schemas.document_schema import (
    DocumentResponse,
    DocumentDetailsResponse,
    RenameDocumentRequest,
    RenameDocumentResponse,
    SearchDocumentResponse,
    DocumentStatisticsResponse,
)

from app.services.document_service import (
    upload_document,
    get_user_documents,
    get_document_details,
    delete_uploaded_document,
    rename_uploaded_document,
    download_document,
    search_user_documents,
    get_document_statistics,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

# --------------------------------------------------
# Upload Document
# --------------------------------------------------

@router.post(
    "/upload",
    response_model=DocumentResponse,
)
def upload(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    return upload_document(
        file=file,
        current_user=current_user,
    )


# --------------------------------------------------
# My Documents
# --------------------------------------------------

@router.get("/")
def get_documents(
    current_user: dict = Depends(get_current_user),
):
    return get_user_documents(current_user)


# --------------------------------------------------
# Search Documents
# --------------------------------------------------

@router.get(
    "/search/",
    response_model=list[SearchDocumentResponse],
)
def search(
    filename: str,
    current_user: dict = Depends(get_current_user),
):
    return search_user_documents(
        filename=filename,
        current_user=current_user,
    )


# --------------------------------------------------
# Document Statistics
# --------------------------------------------------

@router.get(
    "/stats",
    response_model=DocumentStatisticsResponse,
)
def statistics(
    current_user: dict = Depends(get_current_user),
):
    return get_document_statistics(
        current_user
    )


# --------------------------------------------------
# Document Details
# --------------------------------------------------

@router.get(
    "/{document_id}",
    response_model=DocumentDetailsResponse,
)
def document_details(
    document_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = get_document_details(
        document_id=document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="You cannot access this document",
        )

    return result


# --------------------------------------------------
# Rename Document
# --------------------------------------------------

@router.put(
    "/{document_id}",
    response_model=RenameDocumentResponse,
)
def rename(
    document_id: str,
    request: RenameDocumentRequest,
    current_user: dict = Depends(get_current_user),
):
    result = rename_uploaded_document(
        document_id=document_id,
        filename=request.filename,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="You cannot rename this document",
        )

    return result


# --------------------------------------------------
# Download Document
# --------------------------------------------------

@router.get("/download/{document_id}")
def download(
    document_id: str,
    current_user: dict = Depends(get_current_user),
):
    file_path = download_document(
        document_id=document_id,
        current_user=current_user,
    )

    if file_path is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    if file_path == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="You cannot download this document",
        )

    return FileResponse(
        path=file_path,
        filename=file_path.split("\\")[-1],
        media_type="application/octet-stream",
    )


# --------------------------------------------------
# Delete Document
# --------------------------------------------------

@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = delete_uploaded_document(
        document_id=document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this document",
        )

    return result