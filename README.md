# Trekly Web API (Backend)

## Description

Trekly Web API is a RESTful backend service built with **Node.js and Express**.
It provides authentication and CRUD operations that power the Trekly web application.

This backend allows users to register, login, and interact with application resources through secure API endpoints.

This project was developed as part of the **Web API Development (ST6003CEM)** coursework.

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB / PostgreSQL
* JWT Authentication
* Multer (for file uploads)
* Jest & Supertest (for automated testing)

---

## Features

* User registration
* User login authentication
* Protected API routes
* CRUD operations for application resources
* File upload support
* Automated backend testing
* Modular REST API architecture

---

## Project Structure

src/

config/ → database and configuration files
middlewares/ → authentication & validation middleware
modules/ → application modules (auth, users, etc.)
utils/ → helper utilities
**tests**/ → automated tests

app.ts → Express app configuration
server.ts → application entry point

---

## Installation

Clone the repository

git clone https://github.com/yourusername/trekly-backend.git

Install dependencies

npm install

---

## Environment Variables

Create a `.env` file in the root directory.

Example configuration:

PORT=5000
DATABASE_URL=your_database_connection
JWT_SECRET=your_secret_key

---

## Running the Server

Run development server

npm run dev

Run production server

npm start

---

## Running Tests

Run automated tests

npm run test

Tests are implemented using **Jest and Supertest** to ensure API reliability.

---

## API Endpoints

### Authentication

POST /api/auth/register
Register a new user

POST /api/auth/login
Login user and return authentication token

---

### Users

GET /api/users
Retrieve all users

GET /api/users/:id
Retrieve a specific user

PUT /api/users/:id
Update user details

DELETE /api/users/:id
Delete a user

---

## Example Request

POST /api/auth/login

Request body:

{
"email": "[user@example.com](mailto:user@example.com)",
"password": "password123"
}

---

## Testing

Automated tests are implemented to verify:

* User authentication
* Protected route access
* CRUD functionality
* Error handling for invalid requests

---

## Author

Samikshya Baniya
