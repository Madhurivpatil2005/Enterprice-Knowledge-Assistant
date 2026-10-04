from fastapi import APIRouter, Depends

from app.agent.agent_models import (
    AgentAction,
    AgentCommandRequest,
    AgentCommandResponse,
)

from app.agent.agent_service import (
    understand_command,
)

from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/agent",
    tags=["Agent"],
)


@router.post(
    "/command",
    response_model=AgentCommandResponse,
)
async def execute_agent_command(
    request: AgentCommandRequest,
    current_user=Depends(get_current_user),
):
    tool, parameters = understand_command(
        request.command
    )

    # ==================================================
    # NAVIGATION
    # ==================================================

    if tool == "navigate":
        return AgentCommandResponse(
            message=(
                f"Opening "
                f"{parameters['page'].replace('-', ' ')}."
            ),
            action=AgentAction(
                type="navigation",
                tool="navigate",
                parameters=parameters,
            ),
        )

    # ==================================================
    # DOCUMENTS
    # ==================================================

    if tool == "list_documents":
        return AgentCommandResponse(
            message=(
                "I'll show your documents."
            ),
            action=AgentAction(
                type="tool",
                tool="list_documents",
                parameters={},
            ),
        )

    # ==================================================
    # CONVERSATIONS
    # ==================================================

    if tool == "create_conversation":
        return AgentCommandResponse(
            message=(
                "I'll create a new conversation."
            ),
            action=AgentAction(
                type="tool",
                tool="create_conversation",
                parameters={},
            ),
        )

    # ==================================================
    # RENAME DOCUMENT
    # ==================================================

    if tool == "rename_document":
        return AgentCommandResponse(
            message=(
                f"I'll rename "
                f"{parameters['old_filename']} "
                f"to "
                f"{parameters['new_filename']}."
            ),
            action=AgentAction(
                type="tool",
                tool="rename_document",
                parameters=parameters,
            ),
        )

    # ==================================================
    # DELETE DOCUMENT
    # ==================================================

    if tool == "delete_document":
        return AgentCommandResponse(
            message=(
                f"I found the request to delete "
                f"{parameters['filename']}."
            ),
            action=AgentAction(
                type="tool",
                tool="delete_document",
                parameters=parameters,
                requires_confirmation=True,
            ),
        )

    # ==================================================
    # SUMMARIZE DOCUMENT
    # ==================================================

    if tool == "summarize_document":
        return AgentCommandResponse(
            message=(
                "I'll generate a summary "
                "of the requested document."
            ),
            action=AgentAction(
                type="tool",
                tool="summarize_document",
                parameters=parameters or {},
            ),
        )

    # ==================================================
    # GENERATE KEYWORDS
    # ==================================================

    if tool == "generate_keywords":
        return AgentCommandResponse(
            message=(
                "I'll extract the important "
                "keywords from the requested document."
            ),
            action=AgentAction(
                type="tool",
                tool="generate_keywords",
                parameters=parameters or {},
            ),
        )

    # ==================================================
    # GENERATE KEY POINTS
    # ==================================================

    if tool == "generate_key_points":
        return AgentCommandResponse(
            message=(
                "I'll extract the important "
                "key points from the requested document."
            ),
            action=AgentAction(
                type="tool",
                tool="generate_key_points",
                parameters=parameters or {},
            ),
        )

    # ==================================================
    # GENERATE FAQs
    # ==================================================

    if tool == "generate_faqs":
        return AgentCommandResponse(
            message=(
                "I'll generate FAQs "
                "from the requested document."
            ),
            action=AgentAction(
                type="tool",
                tool="generate_faqs",
                parameters=parameters or {},
            ),
        )

    # ==================================================
    # GENERATE INTERVIEW QUESTIONS
    # ==================================================

    if tool == "generate_interview_questions":
        return AgentCommandResponse(
            message=(
                "I'll generate interview questions "
                "from the requested document."
            ),
            action=AgentAction(
                type="tool",
                tool="generate_interview_questions",
                parameters=parameters or {},
            ),
        )

    # ==================================================
    # SUGGEST QUESTIONS
    # ==================================================

    if tool == "suggest_questions":
        return AgentCommandResponse(
            message=(
                "I'll suggest useful questions "
                "based on the requested document."
            ),
            action=AgentAction(
                type="tool",
                tool="suggest_questions",
                parameters=parameters or {},
            ),
        )

    # ==================================================
    # UNKNOWN COMMAND
    # ==================================================

    return AgentCommandResponse(
        message=(
            "I understand that you need help, "
            "but I don't have a tool for that "
            "action yet."
        )
    )