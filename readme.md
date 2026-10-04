# Enterprise Knowledge Assistant

An AI-powered enterprise knowledge management platform that enables users to upload documents, search and interact with their knowledge base, ask questions using Retrieval-Augmented Generation (RAG), generate AI-powered document insights, and control application features through an intelligent AI Agent.

---

## 🚀 Project Overview

The **Enterprise Knowledge Assistant** is a full-stack AI application designed to make organizational documents easier to search, understand, and use.

Users can upload documents and interact with them using natural-language queries. The system retrieves relevant document content using semantic search and provides context-aware responses using a Generative AI model.

The platform also includes an **Enterprise AI Agent** that can perform application-level actions such as navigation, document management, conversation creation, and AI tool execution.

The system provides separate experiences for normal users and administrators through role-based access control.

---

## 🎯 Problem Statement

Organizations often store large amounts of information across documents, making it difficult for users to quickly locate relevant information and understand lengthy content.

Traditional keyword-based document search may not understand the semantic meaning of a user's question.

The Enterprise Knowledge Assistant addresses this problem by combining:

- Document management
- Semantic search
- Retrieval-Augmented Generation
- Generative AI
- Persistent conversations
- AI-powered document analysis
- Intelligent application automation

This allows users to interact with their documents using natural language instead of manually searching through files.

---

## 🎯 Project Objectives

The main objectives of the project are:

- Provide secure user authentication.
- Allow users to upload and manage documents.
- Maintain user-specific document access.
- Convert document content into searchable vector representations.
- Retrieve relevant document content using semantic similarity.
- Generate context-aware answers using RAG.
- Maintain persistent conversation history.
- Provide AI-powered document analysis tools.
- Provide an intelligent application-level AI Agent.
- Provide role-based administration and analytics.
- Provide a responsive and professional user interface.
- Support containerized backend deployment using Docker.

---

# ✨ Features

## 🔐 Authentication & Security

- User registration
- User login
- JWT-based authentication
- Password hashing
- Protected API endpoints
- Role-based access control
- User-specific data isolation
- Admin and normal-user roles

---

## 📄 Document Management

Authenticated users can manage their own documents.

Features include:

- Upload documents
- View document details
- Search documents
- Download documents
- Rename documents
- Delete documents
- User-specific document isolation

---

## 🤖 RAG-Powered Knowledge Assistant

The application uses Retrieval-Augmented Generation to answer questions using uploaded documents.

The workflow includes:

1. Document upload
2. Text extraction
3. Text processing
4. Text chunking
5. Embedding generation
6. Vector storage
7. Semantic retrieval
8. Relevant context selection
9. Generative AI response generation

Users can ask natural-language questions about their uploaded documents and receive context-aware answers.

---

## 💬 Persistent Conversations

The system provides persistent conversations for users.

Users can:

- Create conversations
- Ask questions
- View conversation history
- Rename conversations
- Delete conversations
- Continue previous conversations

---

# 🧠 AI Document Tools

The application provides multiple AI-powered document analysis tools.

### Summary

Generates a concise summary of the selected document.

### Keywords

Extracts important keywords from the document.

### Key Points

Identifies important information and key points.

### FAQs

Generates frequently asked questions and their answers.

### Interview Questions

Generates interview questions based on document content.

### Suggested Questions

Suggests useful questions that users can ask about a document.

---

# ✨ Enterprise AI Agent

The application includes a global AI Agent that can be accessed from the application interface.

The Agent supports natural-language commands for interacting with the application.

### Agent Capabilities

- Navigate between application pages
- List user documents
- Create conversations
- Rename documents
- Delete documents with confirmation
- Generate document summaries
- Generate keywords
- Generate key points
- Generate FAQs
- Generate interview questions
- Generate suggested questions
- Voice input
- Voice responses

The Agent is integrated with existing application services rather than replacing the application's core functionality.

---

# 👨‍💼 Admin Dashboard

Administrators have access to additional management and monitoring capabilities.

## User Management

- View users
- Promote users
- Demote administrators
- Delete users
- View individual user information

## Analytics

- System usage analytics
- User activity analytics
- AI usage statistics
- Individual user reports

## Audit Logs

Administrative activities are recorded through audit logging for monitoring and accountability.

---

# 🏗️ System Architecture

```text
                         ┌───────────────────────┐
                         │     React + Vite      │
                         │       Frontend        │
                         └───────────┬───────────┘
                                     │
                                     │ REST API
                                     ▼
                         ┌───────────────────────┐
                         │        FastAPI        │
                         │        Backend        │
                         └───────────┬───────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             │                       │                       │
             ▼                       ▼                       ▼
      ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
      │   MongoDB    │       │   ChromaDB   │       │  Gemini API  │
      │              │       │              │       │              │
      │ Application  │       │ Vector Store │       │ Generative   │
      │    Data      │       │              │       │      AI      │
      └──────────────┘       └───────┬──────┘       └──────────────┘
                                     │
                                     ▼
                              Semantic Retrieval
                                     │
                                     ▼
                                RAG Pipeline

                        
RAG Workflow
                    Document Upload
                           │
                           ▼
                    Text Extraction
                           │
                           ▼
                     Text Chunking
                           │
                           ▼
               Sentence Transformer
                    Embeddings
                           │
                           ▼
                       ChromaDB
                    Vector Storage
                           │
                           │
                    User Question
                           │
                           ▼
                  Semantic Retrieval
                           │
                           ▼
                Relevant Document Chunks
                           │
                           ▼
                     Gemini API
                           │
                           ▼
                 Context-Aware Answer
                           │
                           ▼
                         User

 🧩 Enterprise Agent Architecture

                                             User Command
                         │
                         ▼
                  Enterprise Agent
                         │
                         ▼
                  Agent Service Layer
                         │
                         ▼
                  Controlled Tools
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
         Documents     Chat       AI Tools
             │           │           │
             └───────────┼───────────┘
                         ▼
                  Existing Services
                         │
                         ▼
                  Application Data

🛠️ Technology Stack

Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Context API
Backend
- Python
- FastAPI
- Pydantic
- JWT Authentication
- Password Hashing
AI / Machine Learning
- Google Gemini API
- Sentence Transformers
- ChromaDB
- Retrieval-Augmented Generation (RAG)
Database
- MongoDB
- MongoDB Atlas
Development Tools
- Visual Studio Code
- Git
- GitHub
- Jupyter / development tools as required
Deployment
- Docker
- Render
- Vercel
- MongoDB Atlas

📁 Project Structure

Rag-Project/
│
├── README.md
├── .gitignore
│
├── backend/
│   │
│   ├── app/
│   │   ├── admin/
│   │   ├── agent/
│   │   ├── ai/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── conversations/
│   │   ├── documents/
│   │   ├── ...
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   └── Dockerfile
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   ├── agent/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── documents/
│   │   │   └── layout/
│   │   │
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
└── ...

⚙️ Local Installation

git clone https://github.com/Madhurivpatil2005/Rag-Project.git

cd Rag-Project
🐍 Backend Setup
Move into the backend directory:
cd backend

Create a Python virtual environment:
python -m venv venv

Windows
Activate the environment:
venv\Scripts\activate

Linux / macOS
source venv/bin/activate

📦 Install Backend Dependencies
pip install -r requirements.txt

🔑 Environment Variables
Create a .env file inside the backend directory.
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=enterprise_knowledge_assistant

SECRET_KEY=your_secret_key
ALGORITHM=your_jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=30

GOOGLE_API_KEY=your_google_api_key

Important
Never commit the actual .env file to GitHub.
Do not expose:
- MongoDB credentials
- Google API keys
- JWT secrets
- Database credentials
- Other private configuration values
Use .env.example to document required variables.
▶️ Run the Backend
From the backend directory:
uvicorn app.main:app --reload

The backend will run at:
http://127.0.0.1:8000

FastAPI documentation:
http://127.0.0.1:8000/docs

⚛️ Frontend Setup
Open another terminal.
Move into the frontend directory:
cd frontend

Install dependencies:
npm install

🔑 Frontend Environment Variable
Create:
frontend/.env

For local development:
VITE_API_URL=http://127.0.0.1:8000

▶️ Run the Frontend
npm run dev

The frontend will normally be available at:
http://localhost:5173

🔮 Future Enhancements
Potential future enhancements include:
- Forgot password / password recovery
- Google OAuth authentication
- Email verification
- Two-factor authentication
- Additional document formats
- Advanced Agent planning
- More enterprise integrations
- Advanced monitoring and observability
- Additional AI models


👩‍💻 Author
Madhuri V Patil
AI & Machine Learning Undergraduate

