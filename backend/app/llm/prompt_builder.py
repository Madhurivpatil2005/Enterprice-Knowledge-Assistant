def build_prompt(
    question: str,
    chunks: list[dict],
) -> str:

    context = ""

    for chunk in chunks:
        context += (
            f"Source: {chunk['filename']} "
            f"(Chunk {chunk['chunk_number']})\n"
            f"{chunk['text']}\n\n"
        )

    prompt = f"""
You are an Enterprise Knowledge Assistant.

Your job is to answer ONLY using the provided document context.

Rules:
1. Never make up information.
2. If the answer is not present in the context, reply:
   "I couldn't find that information in the uploaded documents."
3. Answer in a clear and professional manner.
4. If information comes from multiple chunks, combine it into one answer.
5. Mention the source document name naturally when appropriate.

=========================
DOCUMENT CONTEXT
=========================

{context}

=========================
USER QUESTION
=========================

{question}

=========================
ANSWER
=========================
"""

    return prompt