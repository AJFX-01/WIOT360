# 🚗 Vehicle Operations API

A modern, high-performance backend API built with **Fastify**, **TypeScript**, and **Prisma ORM**. Designed to manage vehicle types, operations, and schedules with full support for **soft deletes**.

---

## 📌 Features

- 🚀 Fastify web server
- 🧠 Type-safe Prisma ORM with PostgreSQL
- ✨ Zod-powered request validation
- 🗑️ Soft delete functionality across all models
- 🧪 Unit testing with Jest
- 🔄 Aggregated data endpoints

---

## 📦 Tech Stack

| Tool         | Purpose                              |
|--------------|--------------------------------------|
| Fastify      | Lightweight HTTP server              |
| TypeScript   | Type safety and modern JS features   |
| Prisma ORM   | DB modeling and type-safe queries    |
| PostgreSQL   | Relational database                  |
| Zod          | Input validation                     |
| Jest         | Unit and integration testing         |

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AJFX-01/WIOT360.git
cd WIOT360
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

Server runs on: **`http://localhost:3000/api`**

---

## 📚 API Overview

### 🚗 Vehicle Types

| Method | Endpoint                        | Description                       |
|--------|----------------------------------|-----------------------------------|
| POST   | `/api/vehicle-types`            | Create a new vehicle type         |
| GET    | `/api/vehicle-types`            | Fetch all active vehicle types    |
| DELETE | `/api/vehicle-types/:id`        | Soft delete a vehicle type        |
| PUT    | `/api/vehicle-types/:id`        | Update a vehicle type        |

### 🧾 Operations

| Method | Endpoint               | Description               |
|--------|------------------------|---------------------------|
| POST   | `/api/operations`      | Create an operation       |
| GET    | `/api/operations`      | Fetch active operations   |
| PUT    | `/api/operations/:id`  | update active operations   |

### 📅 Schedules

| Method | Endpoint                                 | Description                          |
|--------|------------------------------------------|--------------------------------------|
| POST   | `/api/schedules`                         | Create a schedule                    |
| GET    | `/api/vehicle-types/:id/schedules`       | Get schedules for a vehicle type     |
| PUT    | `/api/vehicle-types/:id/`                | Update schedules for a vehicle type  |

### 📊 Aggregates

| Method | Endpoint                                  | Description                               |
|--------|-------------------------------------------|-------------------------------------------|
| GET    | `/api/vehicle-types/:id/aggregates`       | Total operations and schedules count      |

---

## 🔐 Soft Delete Support

Every model includes a `deletedAt` field. Soft-deleted records are **automatically excluded** from API responses.

Deleting a vehicle type also cascades and soft-deletes related operations and schedules:

```http
DELETE /api/vehicle-types/:id
```

---

## 🧪 Running Tests

Make sure your environment is configured, then:

```bash
npm test
```

> Test coverage includes routes, controllers, and edge cases.

---

## 🗂️ Project Structure

```
src/
├── app.ts                    # Server entry point
├── routes/                   # Fastify route definitions
├── controllers/              # Business logic layer
├── validators/               # Zod schema validations
prisma/
├── schema.prisma             # Prisma data models
tests/
├── routes.test.ts           # Unit tests
```

---

## 🔧 Dev Scripts

| Script              | Description                     |
|---------------------|---------------------------------|
| `npm run dev`       | Start the development server    |
| `npm run build`     | Compile TypeScript              |
| `npm test`          | Run Jest tests                  |
| `npx prisma studio` | Open Prisma DB browser UI       |

---

## ERD diagram
![Database Diagram](./prisma/erd.svg)

---

## 🐳 Run with Docker

If you'd like to run the application with Docker, follow the instructions below.

### 1. Docker Prerequisites

Ensure you have **Docker** and **Docker Compose** installed on your system. If you don't have them installed, follow the instructions on the official Docker website:

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### 2. Build and Run the Application

To build the Docker image and run the application, use the following script:

```bash
./docker-run.sh
```

This script will:

- Build the Docker image from the `Dockerfile`.
- Start the application in a Docker container.

### 3. Stop the Application

To stop the running Docker container, use the following script:

```bash
./docker-stop.sh
```

This will stop the running Docker container.

### 4. Configuration via `.env` in Docker

The `.env` file used in the Docker container is injected when the container starts. Make sure your `DATABASE_URL` is correctly set in the `.env` file before running the container.

---

## 📄 License

Licensed under the **MIT License**.  
© 2025 Ajegbomogun Opeyemi 

---

## 💡 Notes

- Always run `npx prisma generate` after editing `schema.prisma`.
- You **can commit** the `generated` folder (especially when using custom Prisma output paths), but it's often ignored if not customized.

```