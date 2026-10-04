from app.search.search_service import search_documents
from app.llm.prompt_builder import build_prompt
from app.llm.title_generator import generate_title
from app.llm.gemini_client import ask_ollama

from app.services.message_service import (
    save_user_message,
    save_assistant_message,
)

from app.services.audit_service import record_audit_log

from app.repositories.conversation_repository import (
    find_conversation_by_id,
    update_conversation_timestamp,
    update_conversation_title,
)


def ask_question(
    conversation_id: str,
    question: str,
    current_user,
):
    # ------------------------------------------
    # Verify conversation exists
    # ------------------------------------------

    conversation = find_conversation_by_id(
        conversation_id,
        current_user["email"],
    )

    if conversation is None:
        return {
            "answer": "Conversation not found.",
            "sources": [],
        }

    # ------------------------------------------
    # Verify conversation belongs to user
    # ------------------------------------------

    if conversation["user_email"] != current_user["email"]:
        return {
            "answer": "Unauthorized.",
            "sources": [],
        }

    # ------------------------------------------
    # Save user message
    # ------------------------------------------

    save_user_message(
        conversation_id,
        question,
    )

    # ------------------------------------------
    # Generate title only for first question
    # ------------------------------------------

    if conversation["title"] == "New Chat":

        print("Generating title...")

        try:
            title = generate_title(question)

            print(
                "Generated title:",
                title,
            )

        except Exception as e:

            print(
                "Title generation failed:",
                e,
            )

            title = (
                question[:40] + "..."
                if len(question) > 40
                else question
            )

        print(
            "Updating MongoDB title..."
        )

        update_conversation_title(
            conversation_id,
            title,
            current_user["email"],
        )

        print(
            "MongoDB title updated."
        )

    # ------------------------------------------
    # Search relevant document chunks
    # ------------------------------------------

    results = search_documents(
        question=question,
        user_email=current_user["email"],
    )

    # ------------------------------------------
    # No documents found
    # ------------------------------------------

    if not results:

        answer = (
            "You haven't uploaded any documents yet."
        )

        save_assistant_message(
            conversation_id,
            answer,
            [],
        )

        update_conversation_timestamp(
            conversation_id,
            current_user["email"],
        )

        # --------------------------------------
        # Record CHAT audit log
        # --------------------------------------

        record_audit_log(
            user_email=current_user["email"],
            action="CHAT",
            resource_type="chat",
            resource_id=conversation_id,
            details="Chat request processed without document results",
        )

        return {
            "answer": answer,
            "sources": [],
        }

    # ------------------------------------------
    # Build Prompt
    # ------------------------------------------

    prompt = build_prompt(
        question=question,
        chunks=results,
    )

    # ------------------------------------------
    # Ask Ollama
    # ------------------------------------------

    answer = ask_ollama(prompt)

    # ------------------------------------------
    # Prepare Source List
    # ------------------------------------------

    sources = []

    seen = set()

    for chunk in results:

        key = (
            chunk["filename"],
            chunk["chunk_number"],
        )

        if key not in seen:

            seen.add(key)

            sources.append(
                {
                    "filename": chunk["filename"],
                    "chunk_number": chunk["chunk_number"],
                }
            )

    # ------------------------------------------
    # Save Assistant Response
    # ------------------------------------------

    save_assistant_message(
        conversation_id,
        answer,
        sources,
    )

    # ------------------------------------------
    # Update Conversation Timestamp
    # ------------------------------------------

    update_conversation_timestamp(
        conversation_id,
        current_user["email"],
    )

    # ------------------------------------------
    # Record CHAT Audit Log
    # ------------------------------------------

    record_audit_log(
        user_email=current_user["email"],
        action="CHAT",
        resource_type="chat",
        resource_id=conversation_id,
        details="Chat request processed successfully",
    )

    # ------------------------------------------
    # Return Response
    # ------------------------------------------

    return {
        "answer": answer,
        "sources": sources,
    }