# FlowBoard — Task Management Application

FlowBoard is a modern, responsive, collaborative task management application designed to organize, track, and streamline daily workflows. Built with a robust React client and an Express backend, it supports full user authentication, task filtering, sorting, and live state updates.

---

## 🚀 Tech Stack

### Frontend (Client)
*   **React 19 & TypeScript:** Component-based UI with compile-time type safety.
*   **TanStack Query (React Query v5):** Asynchronous state management, server-state caching, and query synchronization.
*   **Redux Toolkit & React Redux:** Centralized global client-side state management (auth state, UI preferences).
*   **TailwindCSS v4:** Utility-first styling framework.
*   **React Router v8:** Declarative client-side routing.
*   **React Hook Form:** High-performance form state management.
*   **Zod:** TypeScript-first schema validation for forms and API requests.
*   **Vite:** High-speed development bundler and dev server.

### Backend (Server)
*   **Node.js & Express:** Lightweight, flexible RESTful API server.
*   **TypeScript:** Type safety and code sharing consistency.
*   **MongoDB & Mongoose:** NoSQL document database and Object Data Modeling (ODM).
*   **JSON Web Tokens (JWT):** Session tokens signed on backend and stored securely.
*   **bcryptjs:** Secure hashing library for user password cryptography.
*   **Cookie Parser:** Middleware to securely read auth token cookies.
*   **Helmet:** HTTP headers protection middleware to secure backend requests.
*   **CORS:** Middleware configuring safe Cross-Origin Resource Sharing.
*   **Express Rate Limit:** Middleware limiting rapid repeated API hits (e.g., auth throttling).
*   **Zod:** Server-side request payload schema validation.
*   **TSX:** TypeScript execution watcher for dev-mode live restarts.

### DevOps & Containerization
*   **Docker & Docker Compose:** Containerized execution with hot-reloading configuration.

---

## 🛠️ Local Development Setup

You can run this project either using **Docker Compose** (recommended) or by running the client and server **locally**.

### Method A: Running with Docker Compose (Recommended)

1.  Clone the repository.
2.  Ensure you have **Docker Desktop** installed and running on your system.
3.  Configure your environment variables (see [Environment Variables](#-environment-variables)).
4.  Run the application in development mode:
    ```bash
    docker compose up --build
    ```
5.  Open your browser and navigate to:
    *   **Frontend UI:** `http://localhost:5173`
    *   **Backend Server:** `http://localhost:8000/api`

> [!TIP]
> This docker setup uses **volumes** and **polling/file watching** (`CHOKIDAR_USEPOLLING=true`). Any changes you make to either the `client` or `server` code files will hot-reload instantly inside the containers.

---

### Method B: Manual Local Setup (Without Docker)

#### Prerequisites
*   **Node.js** (v18 or higher recommended)
*   **MongoDB** (running locally or a cloud-based Atlas instance)

#### 1. Setup the Server (Backend)
1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
4.  Start the backend development server:
    ```bash
    npm run dev
    ```

#### 2. Setup the Client (Frontend)
1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port the backend listens on | `8000` |
| `MONGO_URL` | MongoDB connection URI | `mongodb+srv://...` or `mongodb://localhost:27017/task-app` |
| `JWT_SECRET` | Secret key used to sign JWT cookies | `super_secret_token_key_123!` |
| `NODE_ENV` | Environment stage (`development`/`production`) | `development` |
| `CLIENT_URL` | The URL of the frontend application (for CORS) | `http://localhost:5173` |

### Client (`client/.env`)

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The absolute base URL of the backend API | `http://localhost:8000/api` |

---

## 📡 API Endpoint Documentation

All backend API paths are prefixed with `/api`. All task endpoints require a valid session (managed via `token` cookies).

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response (200/201 OK) |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Registers a new user. | `{ "name": "Name", "email": "test@gmail.com", "password": "password" }` | `{ "user": { "id": "...", "name": "...", "email": "..." } }` (Sets token cookie) |
| **POST** | `/login` | Authenticates an existing user. | `{ "email": "test@gmail.com", "password": "password" }` | `{ "user": { "id": "...", "name": "...", "email": "..." } }` (Sets token cookie) |
| **GET** | `/me` | Fetches details of the logged-in user. | *None (Requires token)* | `{ "user": { "name": "...", "email": "..." } }` |
| **POST** | `/logout` | Signs out user and clears cookies. | *None* | `{ "message": "Logged out successfully" }` |

### Task Endpoints (`/api/tasks`)

All task requests require authentication. User context is automatically resolved via the session cookie.

| Method | Endpoint | Description | Request Body | Response (200 OK) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Retrieve all tasks created by the logged-in user. | *None* | `[ { "id": "...", "title": "...", "description": "...", "status": "todo", "priority": "medium", "dueDate": "YYYY-MM-DD", "createdBy": "user_email" }, ... ]` |
| **POST** | `/` | Create a new task. | `{ "title": "...", "description": "...", "priority": "low/medium/high", "status": "todo/in-progress/done", "dueDate": "YYYY-MM-DD" }` | `{ "id": "...", "title": "...", "description": "...", "status": "...", "priority": "...", "dueDate": "..." }` |
| **PUT** | `/:id` | Update an existing task's fields or status. | `{ "title": "...", "description": "...", "status": "...", "priority": "...", "dueDate": "..." }` (All optional) | `{ "id": "...", "title": "...", "status": "..." }` (Updated task object) |
| **DELETE** | `/:id` | Permanently delete a task. | *None* | `{ "id": "deleted_id" }` |

---

## 🎨 User Interface & Screenshots

### Sign In Screen
FlowBoard features a premium dark/light mode auth portal to secure your tasks.



### Key Features visible in UI:
*   **Authentication Portal:** Modern validation on login and sign up inputs.
*   **Kanban Task Dashboard:** Categorizes tasks dynamically into "To Do", "In Progress", and "Done" columns.
*   **Task Modals:** Easy creation and updates for titles, descriptions, due dates, statuses, and priority flags (Low, Medium, High).
*   **Micro-interactions & Responsive Layouts:** Optimized for all desktop and mobile screen sizes.
