from bson import ObjectId

from app.core.database import db
from app.vectorstore.chroma_client import collection
from app.llm.gemini_client import ask_ollama
from app.services.audit_service import record_audit_log


documents_collection = db["documents"]


# ==================================================
# HELPER: GET DOCUMENT CONTENT
# ==================================================

def get_document_content(
    document_id: str,
    current_user: dict,
):

    # Validate MongoDB ObjectId
    if not ObjectId.is_valid(document_id):
        return None

    # Find document belonging to current user
    document = documents_collection.find_one(
        {
            "_id": ObjectId(document_id),
            "user_email": current_user["email"],
        }
    )

    if document is None:
        return None

    # Get document chunks from ChromaDB
    try:
        results = collection.get(
            where={
                "$and": [
                    {"document_id": document_id},
                    {"user_email": current_user["email"]},
                ]
            }
        )
    except Exception as e:
        print("ChromaDB document retrieval error:", e)

        return {
            "document_id": document_id,
            "filename": document["filename"],
            "text": "",
        }

    chunks = results.get("documents", [])

    if not chunks:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "text": "",
        }

    # Join all document chunks
    document_text = "\n\n".join(
        chunk for chunk in chunks if chunk
    )

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "text": document_text,
    }


# ==================================================
# HELPER: CLEAN MARKDOWN
# ==================================================

def clean_ai_line(line: str) -> str:

    line = line.strip()

    # Remove common markdown formatting
    line = line.replace("**", "")
    line = line.replace("__", "")

    return line.strip()


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

    if document is None:
        return None

    if not document["text"]:
        return {
            "document_id": document_id,
            "filename": document["filename"],
            "summary": (
                "No readable content was found in this document."
            ),
        }

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Create a clear and useful summary of the document below.

Rules:
- Use ONLY the document content provided.
- Do not invent information.
- Keep important facts, names, dates, skills,
  technologies, projects, and other important details.
- Organize the summary clearly.
- Use bullet points when appropriate.
- Make the summary easy to read.
- Do not mention that you are an AI.

Document:

{document["text"]}

Summary:
"""

    summary = ask_ollama(prompt)

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

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Extract the most important keywords and concepts
from the document below.

Rules:
- Use ONLY the document content.
- Return exactly 15 important keywords.
- Include important skills, technologies, tools,
  concepts, projects, organizations, and domain terms.
- Do not explain the keywords.
- Do not repeat keywords.
- Do not invent information.
- Return ONLY a comma-separated list.
- Do not number the keywords.

Document:

{document["text"]}

Keywords:
"""

    result = ask_ollama(prompt)

    record_audit_log(
        user_email=current_user["email"],
        action="DOCUMENT_KEYWORDS",
        resource_type="ai",
        resource_id=document_id,
    )

    keywords = []
    seen = set()

    # Handle comma separated output
    raw_keywords = result.replace("\n", ",").split(",")

    for keyword in raw_keywords:

        keyword = clean_ai_line(keyword)

        # Remove bullets
        keyword = keyword.lstrip("-*•").strip()

        # Remove simple numbering
        if ". " in keyword:
            first_part = keyword.split(". ", 1)[0]

            if first_part.isdigit():
                keyword = keyword.split(". ", 1)[1].strip()

        if not keyword:
            continue

        key = keyword.lower()

        if key not in seen:

            seen.add(key)
            keywords.append(keyword)

        if len(keywords) >= 15:
            break

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

Extract the 8 most important points from the document.

IMPORTANT OUTPUT RULES:

1. Return EXACTLY 8 points.
2. Each point MUST be on a separate line.
3. Start every point with POINT 1:, POINT 2:, etc.
4. Each point must contain only ONE important fact.
5. Keep each point short and complete.
6. Do not combine multiple facts into one point.
7. Do not write an introduction.
8. Do not write a conclusion.
9. Do not use paragraphs.
10. Use ONLY information from the document.
11. Do not invent information.

Use EXACTLY this format:

POINT 1: ...
POINT 2: ...
POINT 3: ...
POINT 4: ...
POINT 5: ...
POINT 6: ...
POINT 7: ...
POINT 8: ...

Document:

{document["text"]}

Key Points:
"""

    result = ask_ollama(prompt)

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
    # Parse Key Points
    # ------------------------------------------

    key_points = []
    seen = set()

    for line in result.splitlines():

        line = clean_ai_line(line)

        if not line:
            continue

        upper_line = line.upper()

        # Accept:
        # POINT 1: ...
        # POINT 2: ...
        if upper_line.startswith("POINT"):

            if ":" in line:
                line = line.split(
                    ":",
                    1
                )[1].strip()

        # Also handle bullets if Ollama adds them
        line = line.lstrip("-*•").strip()

        if not line:
            continue

        # Remove accidental numbering
        # Example:
        # 1. Python
        # 2. Java

        if ". " in line:

            first_part = line.split(
                ". ",
                1
            )[0]

            if first_part.isdigit():

                line = line.split(
                    ". ",
                    1
                )[1].strip()

        if not line:
            continue

        key = line.lower()

        if key not in seen:

            seen.add(key)
            key_points.append(line)

        if len(key_points) >= 8:
            break

    # ------------------------------------------
    # Return Result
    # ------------------------------------------

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

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Create frequently asked questions based ONLY
on the document below.

Rules:
- Create exactly 8 useful FAQs.
- Use only information present in the document.
- Do not invent information.
- Keep each answer concise and complete.
- Each answer should be about 1 to 2 sentences.
- Do not repeat questions.

Use EXACTLY this format:

QUESTION: ...
ANSWER: ...

QUESTION: ...
ANSWER: ...

Continue until exactly 8 complete question-answer
pairs have been generated.

Document:

{document["text"]}

FAQs:
"""

    result = ask_ollama(prompt)

    record_audit_log(
        user_email=current_user["email"],
        action="DOCUMENT_FAQS",
        resource_type="ai",
        resource_id=document_id,
    )

    faqs = []

    current_question = None
    current_answer = None

    for line in result.splitlines():

        line = clean_ai_line(line)

        if not line:
            continue

        upper_line = line.upper()

        # ------------------------------------------
        # Question
        # ------------------------------------------

        if upper_line.startswith("QUESTION:"):

            current_question = line.split(
                ":",
                1
            )[1].strip()

            current_answer = None

        # ------------------------------------------
        # Answer
        # ------------------------------------------

        elif upper_line.startswith("ANSWER:"):

            current_answer = line.split(
                ":",
                1
            )[1].strip()

            if current_question and current_answer:

                faqs.append(
                    {
                        "question": current_question,
                        "answer": current_answer,
                    }
                )

                current_question = None
                current_answer = None

        if len(faqs) >= 8:
            break

    # Remove duplicate FAQs
    unique_faqs = []
    seen = set()

    for faq in faqs:

        key = faq["question"].lower().strip()

        if key not in seen:

            seen.add(key)
            unique_faqs.append(faq)

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "faqs": unique_faqs[:8],
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
- Create exactly 8 interview questions.
- Cover projects, skills, technologies,
  education, experience, and important claims.
- Include technical questions.
- Include project-based questions.
- Provide a complete expected answer for every question.
- Each expected answer must be concise.
- Each expected answer should be about 1 to 2 sentences.
- Do not invent information.
- Do not repeat questions.
- Complete every answer.
- Do not stop an answer midway.
- Return exactly 8 complete question-answer pairs.

You MUST use exactly this format:

QUESTION: What is ...?
EXPECTED ANSWER: Complete answer here.

QUESTION: How did ...?
EXPECTED ANSWER: Complete answer here.

Do NOT use numbering.
Do NOT use bullet points.
Do NOT add headings between questions.
Do NOT use "Answer:".
Use "EXPECTED ANSWER:" exactly.

Document:

{document["text"]}

Interview Questions:
"""

    result = ask_ollama(prompt)

    # Debugging output
    print("\n")
    print("==========================================")
    print("INTERVIEW AI RAW RESPONSE")
    print("==========================================")
    print(result)
    print("==========================================")
    print("\n")

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

        line = clean_ai_line(line)

        if not line:
            continue

        # Remove common bullet characters
        line = line.lstrip("-*•").strip()

        # Remove numbering:
        # 1. QUESTION:
        # 2. QUESTION:

        if ". " in line:

            first_part = line.split(
                ". ",
                1
            )[0]

            if first_part.isdigit():

                line = line.split(
                    ". ",
                    1
                )[1].strip()

        upper_line = line.upper()

        # ------------------------------------------
        # Detect Question
        # ------------------------------------------

        if upper_line.startswith("QUESTION:"):

            # Save previous complete pair
            if current_question and current_answer:

                questions.append(
                    {
                        "question": current_question,
                        "expected_answer": current_answer,
                    }
                )

            current_question = line.split(
                ":",
                1
            )[1].strip()

            current_answer = None

        # ------------------------------------------
        # Detect Expected Answer
        # ------------------------------------------

        elif upper_line.startswith(
            "EXPECTED ANSWER:"
        ):

            current_answer = line.split(
                ":",
                1
            )[1].strip()

            if current_question and current_answer:

                questions.append(
                    {
                        "question": current_question,
                        "expected_answer": current_answer,
                    }
                )

                current_question = None
                current_answer = None

        # ------------------------------------------
        # Also accept "ANSWER:"
        # ------------------------------------------

        elif upper_line.startswith("ANSWER:"):

            current_answer = line.split(
                ":",
                1
            )[1].strip()

            if current_question and current_answer:

                questions.append(
                    {
                        "question": current_question,
                        "expected_answer": current_answer,
                    }
                )

                current_question = None
                current_answer = None

        if len(questions) >= 8:
            break

    # ------------------------------------------
    # Remove Duplicate Questions
    # ------------------------------------------

    unique_questions = []

    seen = set()

    for item in questions:

        question_text = item[
            "question"
        ].strip()

        answer_text = item[
            "expected_answer"
        ].strip()

        if not question_text:
            continue

        if not answer_text:
            continue

        key = question_text.lower()

        if key not in seen:

            seen.add(key)

            unique_questions.append(
                {
                    "question": question_text,
                    "expected_answer": answer_text,
                }
            )

        if len(unique_questions) >= 8:
            break

    print(
        "Interview questions parsed:",
        len(unique_questions)
    )

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "questions": unique_questions,
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

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Suggest useful questions that a user could ask
about the document.

Rules:
- Use ONLY the document.
- Generate exactly 10 useful questions.
- Cover different aspects of the document.
- Do not answer the questions.
- Do not repeat questions.
- Do not invent topics that are not supported
  by the document.
- Return exactly one question per line.
- Do not number the questions.
- Do not add headings.

Document:

{document["text"]}

Suggested Questions:
"""

    result = ask_ollama(prompt)

    record_audit_log(
        user_email=current_user["email"],
        action="SUGGESTED_QUESTIONS",
        resource_type="ai",
        resource_id=document_id,
    )

    questions = []

    seen = set()

    for line in result.splitlines():

        line = clean_ai_line(line)

        if not line:
            continue

        # Remove bullet characters
        line = line.lstrip("-*•").strip()

        # Remove numbering
        if ". " in line:

            first_part = line.split(
                ". ",
                1
            )[0]

            if first_part.isdigit():

                line = line.split(
                    ". ",
                    1
                )[1].strip()

        if not line:
            continue

        key = line.lower()

        if key not in seen:

            seen.add(key)
            questions.append(line)

        if len(questions) >= 10:
            break

    return {
        "document_id": document_id,
        "filename": document["filename"],
        "questions": questions,
    }
