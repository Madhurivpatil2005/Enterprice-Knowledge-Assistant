from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user

from app.schemas.ai_schema import (
    DocumentAIRequest,
    DocumentSummaryResponse,
    DocumentKeywordsResponse,
    DocumentKeyPointsResponse,
    DocumentFAQResponse,
    InterviewQuestionsResponse,
    SuggestedQuestionsResponse,
)

from app.ai.ai_service import (
    generate_document_summary,
    generate_document_keywords,
    generate_document_key_points,
    generate_document_faqs,
    generate_interview_questions,
    generate_suggested_questions,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI Features"],
)


# ==================================================
# 1. DOCUMENT SUMMARY
# ==================================================

@router.post(
    "/summarize",
    response_model=DocumentSummaryResponse,
)
def summarize_document(
    request: DocumentAIRequest,
    current_user: dict = Depends(get_current_user),
):
    result = generate_document_summary(
        document_id=request.document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return result


# ==================================================
# 2. KEYWORDS
# ==================================================

@router.post(
    "/keywords",
    response_model=DocumentKeywordsResponse,
)
def keywords(
    request: DocumentAIRequest,
    current_user: dict = Depends(get_current_user),
):
    result = generate_document_keywords(
        document_id=request.document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return result


# ==================================================
# 3. KEY POINTS
# ==================================================

@router.post(
    "/key-points",
    response_model=DocumentKeyPointsResponse,
)
def key_points(
    request: DocumentAIRequest,
    current_user: dict = Depends(get_current_user),
):
    result = generate_document_key_points(
        document_id=request.document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return result


# ==================================================
# 4. FAQS
# ==================================================

@router.post(
    "/faqs",
    response_model=DocumentFAQResponse,
)
def faqs(
    request: DocumentAIRequest,
    current_user: dict = Depends(get_current_user),
):
    result = generate_document_faqs(
        document_id=request.document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return result


# ==================================================
# 5. INTERVIEW QUESTIONS
# ==================================================

@router.post(
    "/interview-questions",
    response_model=InterviewQuestionsResponse,
)
def interview_questions(
    request: DocumentAIRequest,
    current_user: dict = Depends(get_current_user),
):
    result = generate_interview_questions(
        document_id=request.document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return result


# ==================================================
# 6. SUGGESTED QUESTIONS
# ==================================================

@router.post(
    "/suggested-questions",
    response_model=SuggestedQuestionsResponse,
)
def suggested_questions(
    request: DocumentAIRequest,
    current_user: dict = Depends(get_current_user),
):
    result = generate_suggested_questions(
        document_id=request.document_id,
        current_user=current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return result