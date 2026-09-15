from fastapi import FastAPI

from app.core.database import db
from app.routers.auth_router import router as auth_router
from app.routers.document_router import router as document_router
from app.routers.chat_router import router as chat_router
from app.routers.conversation_router import router as conversation_router
from app.routers.ai_router import router as ai_router
from app.routers.admin_router import router as admin_router
app = FastAPI(
    title="Enterprise Knowledge Assistant API",
    version="1.0.0"
)
app.include_router(ai_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(conversation_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "message": "Enterprise Knowledge Assistant Backend Running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "database": "Connected"
    }