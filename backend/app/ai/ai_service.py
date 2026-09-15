from bson import ObjectId

from app.core.database import db
from app.vectorstore.chroma_client import collection
from app.llm.gemini_client import ask_gemini

from app.services.audit_service import record_audit_log


documents_collection = db["documents"]


# ==================================================
# Get Document Content
# ==================================================

def get_document_content(
    document_id: str,
    current_user: dict,
):
    """
    Get document metadata from MongoDB
    and all document chunks from ChromaDB.
    """

    # ------------------------------------------
    # Validate ObjectId
    # ------------------------------------------

    try:
        object_id = ObjectId(document_id)
    except Exception:
        return None

    # ------------------------------------------
    # Find document in MongoDB
    # ------------------------------------------

    document = documents_collection.find_one(
        {
            "_id": object_id,
            "user_email": current_user["email"],
        }
    )

    if document is None:
        return None

    # ------------------------------------------
    # Get all chunks from ChromaDB
    # ------------------------------------------

    results = collection.get(
        where={
            "$and": [
                {
                    "document_id": document_id
                },
                {
                    "user_email": current_user["email"]
                }
            ]
        }
    )

    chunks = results.get("documents", [])

    # ------------------------------------------
    # No chunks available
    # ------------------------------------------

    if not chunks:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "text": "",
        }

    # ------------------------------------------
    # Combine chunks
    # ------------------------------------------

    document_text = "\n\n".join(chunks)

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "text": document_text,
    }


# ==================================================
# 1. DOCUMENT SUMMARY
# ==================================================

def generate_document_summary(
    document_id: str,
    current_user: dict,
):

    document = get_document_content(
        document_id=document_id,
        current_user=current_user,
    )

    # ------------------------------------------
    # Document not found
    # ------------------------------------------

    if document is None:
        return None

    # ------------------------------------------
    # No readable content
    # ------------------------------------------

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "summary": "No readable content was found in this document.",
        }

    # ------------------------------------------
    # Summary Prompt
    # ------------------------------------------

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Create a clear and useful summary of the document below.

Rules:
- Use ONLY the document content provided.
- Do not invent information.
- Keep important facts, names, dates, skills,
  technologies, projects, and other important details.
- Organize the summary with headings and bullet points
  when appropriate.
- Make the summary easy to read.
- Do not mention that you are an AI.

Document:

{document["text"]}

Summary:
"""

    # ------------------------------------------
    # Generate Summary
    # ------------------------------------------

    summary = ask_gemini(prompt)

    # ------------------------------------------
    # Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="DOCUMENT_SUMMARY",
        resource_type="ai",
        resource_id=document_id,
    )

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "summary": summary.strip(),
    }


# ==================================================
# 2. KEYWORDS
# ==================================================

def generate_document_keywords(
    document_id: str,
    current_user: dict,
):

    document = get_document_content(
        document_id=document_id,
        current_user=current_user,
    )

    if document is None:
        return None

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "keywords": [],
        }

    # ------------------------------------------
    # Keyword Prompt
    # ------------------------------------------

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Extract the most important keywords and concepts
from the document below.

Rules:
- Use ONLY the document content.
- Return 10 to 20 important keywords.
- Include important skills, technologies, tools,
  concepts, projects, organizations, and domain terms.
- Do not explain the keywords.
- Do not invent keywords that are not supported
  by the document.
- Return ONLY a comma-separated list.

Document:

{document["text"]}

Keywords:
"""

    result = ask_gemini(prompt)

    # ------------------------------------------
    # Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="DOCUMENT_KEYWORDS",
        resource_type="ai",
        resource_id=document_id,
    )

    # ------------------------------------------
    # Convert response to list
    # ------------------------------------------

    keywords = []

    for keyword in result.split(","):

        keyword = keyword.strip()

        if keyword:
            keywords.append(keyword)

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "keywords": keywords,
    }


# ==================================================
# 3. KEY POINTS
# ==================================================

def generate_document_key_points(
    document_id: str,
    current_user: dict,
):

    document = get_document_content(
        document_id=document_id,
        current_user=current_user,
    )

    if document is None:
        return None

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "key_points": [],
        }

    # ------------------------------------------
    # Key Points Prompt
    # ------------------------------------------

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Extract the most important points from the document.

Rules:
- Use ONLY the document.
- Do not invent information.
- Return 8 to 15 important points.
- Each point must be concise.
- Focus on important facts, achievements,
  projects, skills, technologies, dates,
  responsibilities, and conclusions.
- Return one point per line.
- Do not number the points.

Document:

{document["text"]}

Key Points:
"""

    result = ask_gemini(prompt)

    # ------------------------------------------
    # Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="DOCUMENT_KEY_POINTS",
        resource_type="ai",
        resource_id=document_id,
    )

    # ------------------------------------------
    # Convert response to list
    # ------------------------------------------

    key_points = []

    for line in result.splitlines():

        line = line.strip()

        if not line:
            continue

        if line.startswith("-"):
            line = line[1:].strip()

        if line.startswith("*"):
            line = line[1:].strip()

        key_points.append(line)

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "key_points": key_points,
    }


# ==================================================
# 4. FAQ GENERATOR
# ==================================================

def generate_document_faqs(
    document_id: str,
    current_user: dict,
):

    document = get_document_content(
        document_id=document_id,
        current_user=current_user,
    )

    if document is None:
        return None

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "faqs": [],
        }

    # ------------------------------------------
    # FAQ Prompt
    # ------------------------------------------

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Create frequently asked questions based ONLY
on the document below.

Rules:
- Create 8 to 10 useful FAQs.
- Use only information present in the document.
- Do not invent information.
- Keep answers concise.
- Use exactly this format:

QUESTION: ...
ANSWER: ...

Document:

{document["text"]}

FAQs:
"""

    result = ask_gemini(prompt)

    # ------------------------------------------
    # Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="DOCUMENT_FAQS",
        resource_type="ai",
        resource_id=document_id,
    )

    # ------------------------------------------
    # Parse FAQs
    # ------------------------------------------

    faqs = []

    current_question = None
    current_answer = None

    for line in result.splitlines():

        line = line.strip()

        if not line:
            continue

        upper_line = line.upper()

        if upper_line.startswith("QUESTION:"):

            current_question = line.split(
                ":",
                1
            )[1].strip()

        elif upper_line.startswith("ANSWER:"):

            current_answer = line.split(
                ":",
                1
            )[1].strip()

            if current_question:

                faqs.append(
                    {
                        "question": current_question,
                        "answer": current_answer,
                    }
                )

                current_question = None
                current_answer = None

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "faqs": faqs,
    }


# ==================================================
# 5. INTERVIEW QUESTIONS
# ==================================================

def generate_interview_questions(
    document_id: str,
    current_user: dict,
):

    document = get_document_content(
        document_id=document_id,
        current_user=current_user,
    )

    if document is None:
        return None

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "questions": [],
        }

    # ------------------------------------------
    # Interview Prompt
    # ------------------------------------------

    prompt = f"""
You are an expert technical interviewer.

Analyze the document and create interview questions
based ONLY on its content.

Rules:
- Create 10 interview questions.
- Cover projects, skills, technologies,
  education, experience, and important claims.
- Include technical and project-based questions.
- Provide a short expected answer for every question.
- Do not invent information.
- Use exactly this format:

QUESTION: ...
EXPECTED ANSWER: ...

Document:

{document["text"]}

Interview Questions:
"""

    result = ask_gemini(prompt)

    # ------------------------------------------
    # Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="INTERVIEW_QUESTIONS",
        resource_type="ai",
        resource_id=document_id,
    )

    # ------------------------------------------
    # Parse Questions
    # ------------------------------------------

    questions = []

    current_question = None
    current_answer = None

    for line in result.splitlines():

        line = line.strip()

        if not line:
            continue

        upper_line = line.upper()

        if upper_line.startswith("QUESTION:"):

            current_question = line.split(
                ":",
                1
            )[1].strip()

        elif upper_line.startswith("EXPECTED ANSWER:"):

            current_answer = line.split(
                ":",
                1
            )[1].strip()

            if current_question:

                questions.append(
                    {
                        "question": current_question,
                        "expected_answer": current_answer,
                    }
                )

                current_question = None
                current_answer = None

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "questions": questions,
    }


# ==================================================
# 6. SUGGESTED QUESTIONS
# ==================================================

def generate_suggested_questions(
    document_id: str,
    current_user: dict,
):

    document = get_document_content(
        document_id=document_id,
        current_user=current_user,
    )

    if document is None:
        return None

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "questions": [],
        }

    # ------------------------------------------
    # Suggested Questions Prompt
    # ------------------------------------------

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Suggest useful questions that a user could ask
about the document.

Rules:
- Use ONLY the document.
- Generate 10 useful questions.
- Cover different aspects of the document.
- Do not answer the questions.
- Do not invent topics that are not supported
  by the document.
- Return one question per line.
- Do not number the questions.

Document:

{document["text"]}

Suggested Questions:
"""

    result = ask_gemini(prompt)

    # ------------------------------------------
    # Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="SUGGESTED_QUESTIONS",
        resource_type="ai",
        resource_id=document_id,
    )

    # ------------------------------------------
    # Convert response to list
    # ------------------------------------------

    questions = []

    for line in result.splitlines():

        line = line.strip()

        if not line:
            continue

        if line.startswith("-"):
            line = line[1:].strip()

        elif line.startswith("*"):
            line = line[1:].strip()

        # Remove simple numbering such as:
        # 1. Question
        # 2. Question

        if len(line) >= 3:

            if line[0].isdigit() and line[1] == ".":
                line = line[2:].strip()

        if line:
            questions.append(line)

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "questions": questions,
    }