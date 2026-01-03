# Designsyncs Agency CRM

A professional, high-performance Agency CRM designed for design and development teams. It automates onboarding workflows and provides role-specific dashboards.

## Features

- **RBAC (Role Based Access Control)**:
    - **Admin**: Full control over clients, team, and reporting.
    - **Team**: View personal tasks and update their specific status.
    - **Client**: Real-time project progress tracking.
- **Automated Workflow**: Adding a client creates a Project + 4 Tasks (Content -> UI/UX -> Dev -> SEO) assigned to relevant specialists.
- **Modern UI**: Built with Tailwind CSS, Lucide icons, and responsive layouts.
- **Progress Tracking**: Real-time project percentage calculation based on task completion.

## Prerequisites

- Node.js (v16+)
- MongoDB (Running locally or Atlas)

## Installation & Setup

1. **Clone the project**
2. **Backend Setup**:
    cd server
    npm install
    cp .env.example .env
    # Update .env with your MONGO_URI and JWT_SECRET

3. **Frontend Setup**:
    cd client
    npm install

## Running the Application

1. **Start Backend**:
    cd server
    npm run dev

2. **Start Frontend**:
    cd client
    npm run dev

3. **Access the CRM**:
    Visit `http://localhost:5173`

## Default Access (Mock Data)
Since this is a fresh install, you need to create the first Admin via the registration API or by manually adding a user to MongoDB with role `admin`.

**Example Admin Registration via Curl**:
    curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name": "Master Admin", "email": "admin@designsyncs.com", "password": "password123", "role": "admin"}'

## Project Structure

- `server/`: Express API with Mongoose models and JWT auth.
- `client/`: Vite-React application with Tailwind CSS and Protected Routes.
- `models/`: Project, Task, and User schemas.
- `controllers/`: Business logic for workflows and status updates.
