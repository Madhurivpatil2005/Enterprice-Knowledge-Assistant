from typing import Any, Dict


AGENT_TOOLS = {
    "navigate": {
        "description": (
            "Navigate the authenticated user to an "
            "application page."
        ),
        "parameters": {
            "page": (
                "dashboard | documents | chat | "
                "ai-tools | profile"
            ),
        },
    },

    "list_documents": {
        "description": (
            "List documents belonging to the "
            "authenticated user."
        ),
        "parameters": {},
    },

    "create_conversation": {
        "description": (
            "Create a new conversation for the "
            "authenticated user."
        ),
        "parameters": {},
    },

    "rename_document": {
        "description": (
            "Rename a document belonging to the "
            "authenticated user."
        ),
        "parameters": {
            "old_filename": (
                "Current filename of the document."
            ),
            "new_filename": (
                "New filename requested by the user."
            ),
        },
    },

    "delete_document": {
        "description": (
            "Delete a document belonging to the "
            "authenticated user. This action requires "
            "explicit confirmation before execution."
        ),
        "parameters": {
            "filename": (
                "Filename of the document to delete."
            ),
        },
        "requires_confirmation": True,
    },

    "summarize_document": {
        "description": (
            "Generate a summary of a document using "
            "the existing AI summarization functionality."
        ),
        "parameters": {
            "document_id": (
                "ID of the document to summarize."
            ),
        },
    },

    "generate_keywords": {
        "description": (
            "Generate important keywords from a document."
        ),
        "parameters": {
            "document_id": (
                "ID of the document."
            ),
        },
    },

    "generate_key_points": {
        "description": (
            "Extract the important key points from "
            "a document."
        ),
        "parameters": {
            "document_id": (
                "ID of the document."
            ),
        },
    },

    "generate_faqs": {
        "description": (
            "Generate frequently asked questions and "
            "answers from a document."
        ),
        "parameters": {
            "document_id": (
                "ID of the document."
            ),
        },
    },

    "generate_interview_questions": {
        "description": (
            "Generate interview questions based on "
            "a document."
        ),
        "parameters": {
            "document_id": (
                "ID of the document."
            ),
        },
    },

    "suggest_questions": {
        "description": (
            "Generate useful questions that the user "
            "can ask about a document."
        ),
        "parameters": {
            "document_id": (
                "ID of the document."
            ),
        },
    },
}


def get_available_tools() -> Dict[str, Dict[str, Any]]:
    return AGENT_TOOLS