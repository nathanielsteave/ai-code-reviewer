# AI Code Reviewer | Diagnostic Tool

AI Code Reviewer is a lightweight client-server application designed for deep Python code inspection. The system utilizes a dual-layer analysis architecture:
1. **Static Analysis (Deterministic):** Leverages `flake8` to instantly catch syntax violations, anti-patterns, and PEP 8 styling deviations.
2. **AI Deep Dive (Heuristic):** Integrates the Llama 3.1 model via the Groq API to uncover logical bugs, architectural flaws, performance bottlenecks, and time complexity (Big O) inefficiencies.

This application is built with a strict focus on low latency and non-blocking asynchronous I/O execution.

## 🏗️ System Architecture

* **Backend:** FastAPI (Python) running on a Uvicorn ASGI server. Engineered with asynchronous endpoints to prevent event loop blocking during LLM inference.
* **AI Engine:** Groq API (`llama-3.1-8b-instant`).
* **Static Linter:** `flake8` (executed via subprocess isolation).
* **Frontend:** Vanilla HTML5, JavaScript, and Tailwind CSS. Dynamically parses and renders AI Markdown responses using `marked.js`.

## ⚙️ Prerequisites

Before initializing the system, ensure your environment meets the following requirements:
* **Python 3.9+** installed natively.
* **Groq API Key**. Obtainable via the [Groq Console](https://console.groq.com/).
* **Flake8** (installed via requirements).

## 🚀 Installation & Execution Guide

Follow these steps precisely to ensure the client and server communicate without cross-origin or dependency failures.

### 1. Environment Isolation
Never pollute your global Python environment. Clone the repository, navigate to the root directory, and isolate your dependencies.

```bash
# Initialize Virtual Environment
python -m venv venv

# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Dependency Installation
With the virtual environment active, install the required packages.

```bash
pip install -r requirements.txt
```

### 3. Environment Variable Configuration
The backend requires Groq credentials to interface with the LLM.

1. Create a .env file in the root directory.
2. Inject your API key using the following format:

```bash
GROQ_API_KEY=your_actual_api_key_here
```
(Note: The .env file is explicitly ignored in .gitignore to prevent credential leakage).

### 4. Ignite the Backend Engine
Navigate to the backend directory and spin up the FastAPI server.

```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Upon success, the terminal will confirm that Uvicorn is listening at http://127.0.0.1:8000. Keep this terminal process running.

### 5. Launch the Frontend Interface
The frontend architecture relies on static asset delivery, requiring no dedicated Node.js server for local development.

1. Open your native File Explorer / Finder.
2. Navigate to the frontend directory.
3. Open index.html directly in any modern web browser (Chrome/Edge/Brave).
