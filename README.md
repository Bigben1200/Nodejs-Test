# Task Management API

This is a RESTful API for managing tasks, built using **Node.js**, **Express**, and **MongoDB**. The API allows users to create, update, delete, and retrieve tasks.

## 🚀 Features

- User authentication (JWT-based)
- Create, update, and delete tasks
- Retrieve all tasks or a single task
- Task status management (`pending`, `in-progress`, `completed`)

---

## 📂 Folder Structure

/src
│── Controllers/ # API controllers
│── Middleware/ # Authentication and validation middleware
│── Models/ # Mongoose models
│── Routes/ # API routes
│── Config/ # Database and environment configuration
│── app.js # Express app setup

## SetUp structure

Create Your env and add MONGO_URI, PORT and a JWT_SECRET
Then run npm install
Then either npm run dev or npm start and the project should fully start.

And run npx jest --coverage for test
