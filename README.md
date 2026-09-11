# Todo List Application

A simple Todo List web application built with **Node.js**, **Express**, **EJS** templating and **MySQL** as the data store. The project demonstrates basic CRUD operations for users, todo items, folders, and commit logs.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features
- User registration and authentication (password hashing with **bcryptjs**)
- Create, read, update, delete **Todo** items
- Organize todos into **folders**
- Track changes with a **commit log**
- Simple front‑end using **EJS** templates

---

## Prerequisites
- **Node.js** (v18 or later) – see [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node) or **yarn**
- **MySQL** server (v5.7+). The project includes a Docker Compose configuration to spin up a MySQL instance automatically.

---

## Installation
```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd todolist

# Install dependencies
npm install   # or: yarn install
```

---

## Configuration
Create a `.env` file in the project root (already provided as an example) with your database credentials:
```dotenv
DB_HOST=127.0.0.1
DB_USER=myuser
DB_PASSWORD=123456
DB_NAME=tododb
DB_PORT=3307
```
> **⚠️ Important:** The `.env` file is excluded from version control via `.gitignore` to keep credentials safe.

---

## Running the Application
```bash
# Start the server (development mode with auto‑restart)
npm run dev

# Or start the server normally
npm start
```
The app will listen on the default port defined in `src/app.js` (usually `3000`). Open your browser and navigate to `http://localhost:3000`.

---

## Docker Setup
A `docker-compose.yml` file is provided to run MySQL in a container.
```bash
# Start MySQL container
docker-compose up -d

# Stop the container
docker-compose down
```
Make sure the database credentials in `.env` match the Docker configuration.

---

## Project Structure
```
├─ src/                # Source code
│   ├─ config/        # DB configuration
│   ├─ controllers/   # Request handlers
│   ├─ models/        # Data models
│   ├─ routes/        # Express route definitions
│   └─ views/         # EJS templates
├─ .env                # Environment variables (not committed)
├─ .gitignore          # Ignored files/folders
├─ package.json        # npm metadata & scripts
└─ README.md           # This file
```

---

## License
This project is licensed under the **ISC** license. See the `LICENSE` file for details.

---

*Happy coding!*