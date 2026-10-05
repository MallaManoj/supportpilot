<div align="center">

  <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=800&size=48&pause=1000&color=6366F1&center=true&vCenter=true&width=600&height=80&lines=🚀+SupportPilot;AI-Powered+Support;Next-Gen+Helpdesk" alt="Typing SVG" />

  <p><strong>Intelligent Customer Support with Retrieval-Augmented Generation (RAG)</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  </p>

  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="80%" />
</div>

<br />

## 🌟 The Vision

**SupportPilot** is a state-of-the-art, AI-powered customer support and troubleshooting platform. It empowers customers to find instant answers using **Retrieval-Augmented Generation (RAG)** backed by your product's documentation. When the AI is uncertain, it seamlessly escalates the conversation to human support agents by generating actionable tickets.

<br />

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🧠 AI Knowledge Base** | Answers queries instantly by vector-searching through embedded product documentation using `pgvector`. |
| **💬 Real-time Chat** | A beautiful, animated UI with glassmorphism effects and built-in dark/light mode support. |
| **🎫 Smart Escalation** | Automatically transitions low-confidence AI responses into structured tickets for human agents. |
| **🛡️ RBAC** | Differentiates between standard users and support agents with a dedicated admin dashboard. |
| **🎨 Premium UI/UX** | Powered by Tailwind CSS, Framer Motion, and Next Themes for a buttery-smooth experience. |

<br />

## 🛠️ Technology Stack

<details>
  <summary><strong>🖥️ Frontend</strong></summary>
  
  - **Framework:** Next.js (App Router), React, TypeScript
  - **Styling:** Tailwind CSS, Framer Motion, Lucide React
  - **State/Auth:** React Context, Next Themes
  - **Testing:** Vitest, React Testing Library
</details>

<details>
  <summary><strong>⚙️ Backend</strong></summary>
  
  - **Framework:** Python, FastAPI
  - **Database:** PostgreSQL with `pgvector` for vector embeddings
  - **ORM & Migrations:** SQLAlchemy, Alembic
  - **AI Integration:** OpenAI API
  - **Testing:** Pytest, pytest-cov
</details>

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="50%" />
</div>

## 🚀 Quick Start Guide

Follow these steps to run SupportPilot locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python (3.12+)
- PostgreSQL (running on port 5432 with a user `manoj` and database `supportpilot`)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/supportpilot.git
cd supportpilot
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
PYTHONPATH=. alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload
```
> 🎯 **Tip:** The backend will be available at `http://localhost:8000`

### 3. Frontend Setup
Open a new terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
> 🎯 **Tip:** The frontend will be available at `http://localhost:3000`

<br />

## 📂 Project Architecture

```text
supportpilot/
├── backend/
│   ├── app/                # FastAPI application code (auth, db, schemas, RAG)
│   ├── migrations_alembic/ # Database migrations
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment variables
│
└── frontend/
    ├── app/                # Next.js app router pages & layouts
    ├── components/         # Reusable React components (AuthForm, AppShell, ChatWindow)
    ├── context/            # React Context (AuthContext)
    ├── lib/                # Utility functions & API fetch wrapper
    └── tailwind.config.ts  # Tailwind CSS configuration
```

<div align="center">
  <i>Built with ❤️ using Next.js and FastAPI</i>
</div>