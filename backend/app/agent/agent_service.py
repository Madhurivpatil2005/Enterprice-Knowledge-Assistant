from typing import Optional, Tuple
import re


PAGE_ALIASES = {
    "dashboard": "dashboard",
    "home": "dashboard",
    "main page": "dashboard",

    "documents": "documents",
    "document": "documents",
    "files": "documents",
    "my files": "documents",
    "my documents": "documents",

    "chat": "chat",
    "conversation": "chat",
    "conversations": "chat",
    "chat page": "chat",

    "ai tools": "ai-tools",
    "ai tool": "ai-tools",
    "aitools": "ai-tools",
    "ai": "ai-tools",

    "profile": "profile",
    "my profile": "profile",
}


def normalize_command(command: str) -> str:
    return " ".join(
        command.lower().strip().split()
    )


def detect_navigation(
    command: str,
) -> Optional[str]:

    normalized = normalize_command(command)

    navigation_phrases = [
        "go to ",
        "open ",
        "take me to ",
        "show me ",
        "show ",
        "take me ",
        "navigate to ",
        "i want to see ",
        "i want to open ",
    ]

    for phrase in navigation_phrases:
        if normalized.startswith(phrase):
            target = normalized[len(phrase):].strip()

            if target in PAGE_ALIASES:
                return PAGE_ALIASES[target]

    return None


def detect_list_documents(
    command: str,
) -> bool:

    normalized = normalize_command(command)

    phrases = [
        "show my documents",
        "show my files",
        "show documents",
        "show files",
        "list my documents",
        "list my files",
        "list documents",
        "list files",
        "view my documents",
        "view my files",
        "view documents",
        "view files",
        "what documents do i have",
        "what files do i have",
        "what documents are uploaded",
        "what files are uploaded",
        "display my documents",
        "display my files",
    ]

    return any(
        phrase in normalized
        for phrase in phrases
    )


def detect_new_conversation(
    command: str,
) -> bool:

    normalized = normalize_command(command)

    phrases = [
        "create a new conversation",
        "create new conversation",
        "new conversation",
        "start a new conversation",
        "start new conversation",
        "create conversation",
        "start conversation",
        "new chat",
        "start a new chat",
        "start new chat",
        "create a new chat",
        "create new chat",
    ]

    return any(
        phrase in normalized
        for phrase in phrases
    )


def detect_rename_document(
    command: str,
) -> Optional[dict]:

    normalized = normalize_command(command)

    patterns = [
        r"rename (.+?) to (.+)",
        r"rename document (.+?) to (.+)",
        r"rename file (.+?) to (.+)",
        r"change (.+?) name to (.+)",
        r"change the name of (.+?) to (.+)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            normalized,
        )

        if match:
            old_name = match.group(1).strip()
            new_name = match.group(2).strip()

            return {
                "old_filename": old_name,
                "new_filename": new_name,
            }

    return None


def detect_delete_document(
    command: str,
) -> Optional[str]:

    normalized = normalize_command(command)

    patterns = [
        r"delete document (.+)",
        r"delete file (.+)",
        r"delete (.+)",
        r"remove document (.+)",
        r"remove file (.+)",
        r"remove (.+)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            normalized,
        )

        if match:
            filename = match.group(1).strip()

            return filename

    return None


def detect_ai_tool(
    command: str,
) -> Optional[Tuple[str, dict]]:

    normalized = normalize_command(command)

    # ==================================================
    # SUMMARY
    # ==================================================

    if any(
        phrase in normalized
        for phrase in [
            "summarize document",
            "summarise document",
            "summarize file",
            "summarise file",
            "summarize my document",
            "summarise my document",
            "summarize my file",
            "summarise my file",
            "summarize this document",
            "summarise this document",
            "summarize this file",
            "summarise this file",
            "summarize the document",
            "summarise the document",
            "summarize the file",
            "summarise the file",
            "summarize my resume",
            "summarise my resume",
            "summarize this resume",
            "summarise this resume",
            "give me a summary",
            "give me the summary",
            "give a summary",
            "get a summary",
            "get me a summary",
            "generate a summary",
            "create a summary",
            "make a summary",
            "provide a summary",
            "please summarize",
            "please summarise",
            "can you summarize",
            "can you summarise",
            "briefly summarize",
            "briefly summarise",
            "give me an overview",
            "give an overview",
            "get an overview",
            "provide an overview",
            "document overview",
            "file overview",
            "what is this document about",
            "what is this file about",
            "what does this document contain",
            "what does this file contain",
        ]
    ):
        return (
            "summarize_document",
            {},
        )

    # ==================================================
    # KEYWORDS
    # ==================================================

    if any(
        phrase in normalized
        for phrase in [
            "generate keywords",
            "generate keyword",
            "get keywords",
            "get keyword",
            "get me keywords",
            "find keywords",
            "find keyword",
            "extract keywords",
            "extract keyword",
            "give me keywords",
            "give me keyword",
            "show me keywords",
            "show keywords",
            "list keywords",
            "identify keywords",
            "important keywords",
            "main keywords",
            "key keywords",
            "keywords from document",
            "keywords from file",
            "keywords in document",
            "keywords in file",
            "keywords of document",
            "keywords of file",
            "please generate keywords",
            "can you generate keywords",
            "what are the keywords",
        ]
    ):
        return (
            "generate_keywords",
            {},
        )

    # ==================================================
    # KEY POINTS
    # ==================================================

    if any(
        phrase in normalized
        for phrase in [
            "generate key points",
            "generate important points",
            "get key points",
            "get me key points",
            "find key points",
            "extract key points",
            "give me key points",
            "show me key points",
            "show key points",
            "list key points",
            "identify key points",
            "important points",
            "important things in the document",
            "important things in the file",
            "main points",
            "main things in the document",
            "main things in the file",
            "key points from document",
            "key points from file",
            "key points in document",
            "key points in file",
            "key points of document",
            "key points of file",
            "what are the important points",
            "what are the main points",
            "tell me the important points",
            "tell me the main points",
            "please generate key points",
            "can you generate key points",
        ]
    ):
        return (
            "generate_key_points",
            {},
        )

    # ==================================================
    # FAQs
    # ==================================================

    if any(
        phrase in normalized
        for phrase in [
            "generate faqs",
            "generate faq",
            "create faqs",
            "create faq",
            "get faqs",
            "get faq",
            "get me faqs",
            "get me faq",
            "give me faqs",
            "give me faq",
            "show me faqs",
            "show me faq",
            "frequently asked questions",
            "generate frequently asked questions",
            "create frequently asked questions",
            "give me frequently asked questions",
            "get frequently asked questions",
            "make faqs",
            "make faq",
            "what are the frequently asked questions",
            "please generate faqs",
            "can you generate faqs",
        ]
    ):
        return (
            "generate_faqs",
            {},
        )

    # ==================================================
    # INTERVIEW QUESTIONS
    # ==================================================

    if any(
        phrase in normalized
        for phrase in [
            "generate interview questions",
            "create interview questions",
            "get interview questions",
            "get me interview questions",
            "give me interview questions",
            "show me interview questions",
            "show interview questions",
            "list interview questions",
            "interview questions",
            "interview questions from document",
            "interview questions from file",
            "interview questions for document",
            "interview questions for file",
            "interview questions based on document",
            "interview questions based on file",
            "prepare interview questions",
            "prepare me for interview",
            "prepare me for an interview",
            "help me prepare for interview",
            "help me prepare for an interview",
            "questions i may be asked in interview",
            "what interview questions can be asked",
            "what questions can be asked in interview",
            "please generate interview questions",
            "can you generate interview questions",
        ]
    ):
        return (
            "generate_interview_questions",
            {},
        )

    # ==================================================
    # SUGGESTED QUESTIONS
    # ==================================================

    if any(
        phrase in normalized
        for phrase in [
            "suggest questions",
            "suggest some questions",
            "suggest a few questions",
            "suggest questions to ask",
            "suggest questions i can ask",
            "what can i ask",
            "what should i ask",
            "what can i ask about this document",
            "what can i ask about this file",
            "what should i ask about this document",
            "what should i ask about this file",
            "questions i can ask",
            "questions to ask",
            "give me questions to ask",
            "give me some questions",
            "give me questions",
            "show me questions i can ask",
            "show me some questions",
            "recommend questions",
            "useful questions",
            "important questions to ask",
            "possible questions to ask",
            "what questions can i ask about this document",
            "what questions can i ask about this file",
            "please suggest questions",
            "can you suggest questions",
        ]
    ):
        return (
            "suggest_questions",
            {},
        )

    return None


def understand_command(
    command: str,
) -> Tuple[str, Optional[dict]]:

    navigation = detect_navigation(command)

    if navigation:
        return (
            "navigate",
            {
                "page": navigation,
            },
        )

    rename_data = detect_rename_document(
        command
    )

    if rename_data:
        return (
            "rename_document",
            rename_data,
        )

    delete_filename = detect_delete_document(
        command
    )

    if delete_filename:
        return (
            "delete_document",
            {
                "filename": delete_filename,
            },
        )

    if detect_list_documents(command):
        return (
            "list_documents",
            {},
        )

    if detect_new_conversation(command):
        return (
            "create_conversation",
            {},
        )

    ai_tool = detect_ai_tool(command)

    if ai_tool:
        return ai_tool

    return "unknown", None