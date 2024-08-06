# Go Quizzer Api

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Description

The Quiz App is designed to offer an interactive and engaging learning experience through quizzes. It empowers tutors to create comprehensive quizzes while providing students with a dynamic environment to take these quizzes, enhanced by timed challenges. This app not only facilitates effective learning but also fosters healthy competition among students.

## Features

- Automatic submission
- Score tracking
- Leaderboards

## Technologies Used

- Node.js
- Express
- MongoDB 
- Additional libraries and frameworks

### Prerequisites

- Node.js
- npm 
- MongoDB

## Installation

- npm install

### Steps

1. Clone the repository:
    ```bash
    https://github.com/diamond-nicholas/quizzer-hackathon.git
    ```
2. Navigate to the project directory:
    ```bash
    cd quizzer-hackathon
    ```
3. Navigate to the project directory:
    ```bash
    cd server
    ```
4. Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Running the Server

1. Ensure MongoDB is running (if applicable):
    ```bash
    mongod
    ```
2. Start the server:
   for development mode with nodemon:
    ```bash
    npm run dev
    ```
3. The server should now be running on `http://localhost:8888` (or your configured port).

### API Endpoints

User
- `POST /api/v1/auth/register` - Register endpoint
- `POST /api/v1/auth/login` - Login endpoint
- `GET /api/v1/auth/self` - Self endpoint
- `POST /api/v1/auth/change-password` - Change password endpoint
- `POST /api/v1/auth/logout` - Logout endpoint

Quiz
- `POST /api/v1/quiz/create` - Quiz creation endpoint
- `PATCH /api/v1/quiz/{quizId}/edit` - Quiz Edit endpoint
- `GET /api/v1/quiz/{quizId}` - Get one quiz endpoint
- `GET /api/v1/quiz` - Get all quiz endpoint
- `PATCH /api/v1/quiz/{quizId}/publish` - Publish quiz endpoint
- `GET /api/v1/quiz/attempt/history` - Get current user quiz history

Question
- `POST /api/v1/question/create` - Question creation endpoint
- `PATCH /api/v1/question/{questionId}/edit` - Question edit endpoint

Attempt
- `POST /api/v1/attempt/{quizId}/quiz` - Attempt quiz endpoint
- `POST /api/v1/attempt/{questionId}/question` - Attempt question endpoint
- `POST /api/v1/attempt/question/{attemptId}/next` - Get next question endpoint
- `POST /api/v1/attempt/question/{attemptId}/prev` - Get prev question endpoint
- `POST /api/v1/attempt/{attemptId}/submit` - Submit quiz

Leaderboard
- `GET /api/v1/leaderboard/{quizId}/top` - Get Leaderboard for a quiz

## Configuration

- Copy the `.env.example` file to `.env` and update the necessary environment variables:
    ```bash
    cp .env.example .env
    ```

### Environment Variables

| Variable           | Description                        |
|--------------------|------------------------------------|
| `PORT`             | The port the server runs on        |
| `MONGO_URL`        | MongoDB connection string          |
| `MONGO_URL_DEV`    | MongoDB connection string          |
| `JWT_SECRET`       | Secret key for JWT                 |
| `JWT_ACCESS_EXPIRATION_MINUTES`     | Secret key for JWT|
| `JWT_REFRESH_EXPIRATION_DAYS`       | Secret key for JWT|
| `JWT_SECRET`       | Secret key for JWT                 |
| `NODE_ENV`         | Node environment(delopment or producion|
| `CLOUDINARY_SECRET_KEY`     | storage for asset key     |
| `CLOUDINARY_API_KEY`        | storage for asset api     |
| `CLOUDINARY_CLOUD_NAME`     |cloud name storage         |



