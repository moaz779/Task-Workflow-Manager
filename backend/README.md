
# Task & Workflow Manager

## Overview

A lightweight web application for personal and small-team productivity. Users can register, authenticate, create and manage tasks, group them into workflows, and track progress.

## Features

* User Registration & JWT Authentication
* CRUD operations for Tasks & Workflows
* Group tasks into Workflows and track status
* Input validation & error handling
* Responsive SPA built with React & Material-UI / Tailwind CSS
* Unit tests for core API endpoints

## Tech Stack

* **Backend:** Node.js, Express, Sequelize, PostgreSQL
* **Frontend:** React, React Router, Formik, Yup, Axios
* **Authentication:** JSON Web Tokens (JWT)
* **Validation:** express-validator (backend), Yup (frontend)
* **Testing:** Jest, Supertest

## Prerequisites

* Node.js v18+ and npm
* PostgreSQL database

## Setup

1. **Clone the repo**

   ```bash
   git clone <repo_url>
   cd project-root
   ```

2. **Backend**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with DATABASE_URL and JWT_SECRET
   npm install
   npm run dev
   ```

3. **Frontend**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Run Tests**

   ```bash
   # From backend directory
   npm test
   ```

## Folder Structure

```
/backend
  ├─ src
  │   ├─ config
  │   ├─ controllers
  │   ├─ middleware
  │   ├─ models
  │   └─ routes
  ├─ tests
  └─ package.json
/frontend
  ├─ public
  ├─ src
  │   ├─ components
  │   ├─ services
  │   └─ routes.js
  └─ package.json
```

## API Endpoints

Refer to [API Documentation](docs/API_Documentation.md) for full list of endpoints, request/response schemas, and error formats.

## Development Guidelines

* Follow feature branches and descriptive commit messages.
* Write unit tests for new backend endpoints.
* Use ESLint and Prettier for code quality.

## Deployment

* Deploy backend on a Node.js-compatible server (e.g., AWS ECS, Heroku). Use environment variables for secrets.
* Build frontend and serve via CDN or static hosting (e.g., Netlify).
