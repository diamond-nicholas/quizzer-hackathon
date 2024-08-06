# Go Quizzer

Welcome to Go Quizzer! This project is a full-stack application that provides an interactive and engaging platform for learning through quizzes. It consists of a backend API built with Node.js and a frontend client for user interaction built with Nextjs.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Project Description

Go Quizzer aims to offer an engaging learning experience through quizzes. It empowers tutors to create comprehensive quizzes while providing students with a dynamic environment to take these quizzes, enhanced by timed challenges. This app not only facilitates effective learning but also fosters healthy competition among students.

## Features

- Automatic submission
- Score tracking
- Leaderboards
- Timed quizzes
- User authentication
- Quiz history

## Technologies Used

### Backend
- Node.js
- Express
- MongoDB

### Frontend
- Nextjs
- Redux
- Tailwind
  
## Prerequisites
- Node.js (version 18. or higher)
- npm 
- MongoDB 

## Installation

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/diamond-nicholas/quizzer-hackathon.git
    ```
2. Navigate to the project directory:
    ```bash
    cd quizzer-hackathon
    ```

### Backend (Server)
1. Navigate to the server directory:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables:
    - Copy the `.env.example` file to `.env` and update the necessary environment variables:
        ```bash
        cp .env.example .env
        ```
4. Ensure MongoDB is running:
    ```bash
    mongod
    ```
5. Start the server:
    ```bash
    npm run dev
    ```

### Frontend (Client)

1. Navigate to the client directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the client:
    ```bash
    npm start
    ```

## Usage

- The backend server should be running on `http://localhost:8888` (or your configured port).
- The frontend client should be running on `http://localhost:3000` (or your configured port).

## Project Structure

quizzer-hackathon/
├── client/ # Frontend code
├── server/ # Backend code
└── README.md # General README



### Backend Endpoints

#### User
- `POST /api/v1/auth/register` - Register endpoint
- `POST /api/v1/auth/login` - Login endpoint
- `GET /api/v1/auth/self` - Self endpoint
- `POST /api/v1/auth/change-password` - Change password endpoint
- `POST /api/v1/auth/logout` - Logout endpoint

#### Quiz
- `POST /api/v1/quiz/create` - Quiz creation endpoint
- `PATCH /api/v1/quiz/{quizId}/edit` - Quiz Edit endpoint
- `GET /api/v1/quiz/{quizId}` - Get one quiz endpoint
- `GET /api/v1/quiz` - Get all quiz endpoint
- `PATCH /api/v1/quiz/{quizId}/publish` - Publish quiz endpoint
- `GET /api/v1/quiz/attempt/history` - Get current user quiz history

#### Question
- `POST /api/v1/question/create` - Question creation endpoint
- `PATCH /api/v1/question/{questionId}/edit` - Question edit endpoint

#### Attempt
- `POST /api/v1/attempt/{quizId}/quiz` - Attempt quiz endpoint
- `POST /api/v1/attempt/{questionId}/question` - Attempt question endpoint
- `POST /api/v1/attempt/question/{attemptId}/next` - Get next question endpoint
- `POST /api/v1/attempt/question/{attemptId}/prev` - Get prev question endpoint
- `POST /api/v1/attempt/{attemptId}/submit` - Submit quiz

#### Leaderboard
- `GET /api/v1/leaderboard/{quizId}/top` - Get Leaderboard for a quiz

## Contributing

We welcome contributions to improve Go Quizzer. Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Description of your changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- Your Name - [Nicholas Diamond](mailto:diamondnicholas154@gmail.com)
- Your Name - [Stanley Sunday](mailto:sundaystanley56@gmail.com)
- Project Link: [https://github.com/diamond-nicholas/quizzer-hackathon](https://github.com/diamond-nicholas/quizzer-hackathon)
