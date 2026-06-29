# Local Development Guide

This guide provides instructions on the required environment and how to run the frontend and backend (server) applications locally.

## Prerequisites

Ensure you have the following versions of Node.js and npm installed:

- **Node.js Version**: `v24+` 
- **npm Version**: `11+`

You can verify your installed versions by running:
```bash
node -v
npm -v
```

---

## Frontend Setup & Execution

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`.*

---

## Backend (Server) Setup & Execution

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## Database Migrations

This project uses **Drizzle ORM** and **Drizzle Kit** to manage database schemas and migrations for MySQL.

### 1. Prerequisites
Ensure you have created a `.env` file in the `server` directory and specified the connection URI for your MySQL database in the `MYSQL_URI` environment variable.

### 2. Generate Migration Files
If you make any changes to the database schema in `src/databases/schema.ts`, you must generate a new SQL migration file:
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Run the migration generator script:
   ```bash
   npm run make-migrations
   ```

### 3. Run/Apply Migrations
To apply the generated migrations to your MySQL database:
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Run the migration runner script:
   ```bash
   npm run migrate
   ```
