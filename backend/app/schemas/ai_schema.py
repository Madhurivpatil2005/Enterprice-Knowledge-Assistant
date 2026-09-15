from pydantic import BaseModel


# ==================================================
# Common AI Request
# ==================================================

class DocumentAIRequest(BaseModel):
    document_id: str


# ==================================================
# Document Summary
# ==================================================

class DocumentSummaryResponse(BaseModel):
    document_id: str
    filename: str
    summary: str


# ==================================================
# Keywords
# ==================================================

class DocumentKeywordsResponse(BaseModel):
    document_id: str
    filename: str
    keywords: list[str]


# ==================================================
# Key Points
# ==================================================

class DocumentKeyPointsResponse(BaseModel):
    document_id: str
    filename: str
    key_points: list[str]


# ==================================================
# FAQs
# ==================================================

class FAQItem(BaseModel):
    question: str
    answer: str


class DocumentFAQResponse(BaseModel):
    document_id: str
    filename: str
    faqs: list[FAQItem]


# ==================================================
# Interview Questions
# ==================================================

class InterviewQuestion(BaseModel):
    question: str
    expected_answer: str


class InterviewQuestionsResponse(BaseModel):
    document_id: str
    filename: str
    questions: list[InterviewQuestion]


# ==================================================
# Suggested Questions
# ==================================================

class SuggestedQuestionsResponse(BaseModel):
    document_id: str
    filename: str
    questions: list[str]