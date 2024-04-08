## Overview

The ReactiveModel test project is designed to demonstrate a simple backend setup using SQLite for database operations,
BeyondJS for bridging WebSocket communications, and an Express server conforming to the OpenAPI standard for RESTful API
development. This document outlines the setup and functionality of the backend distribution.

## Getting Started

When the project is initiated, it establishes a connection to a SQLite database and proceeds to set up the necessary
database tables for operation. Specifically, it creates `users` and `books` tables, ensuring a fresh test environment by
resetting these tables at the start.

### Database Initialization

Upon startup, the following operations are performed on the database:

1. **Users Table**: The `users` table is created with fields for `id`, `name`, `deleted`, `lastnames`, `instance_id`,
   and `time_updated`. If this table already exists, it is dropped and recreated to reset the environment.

    - `id`: Integer, Primary Key, Auto-increment.
    - `name`: Text, name of the user.
    - `deleted`: Integer, a flag to indicate whether the user is deleted.
    - `lastnames`: Text, the last names of the user.
    - `instance_id`: Integer, an identifier for the instance.
    - `time_updated`: Integer, timestamp of the last update.

2. **Books Table**: Similarly, the `books` table is set up with fields for `id`, `title`, `year`, and `author`.

    - `id`: VARCHAR(50), Primary Key.
    - `title`: Text, title of the book.
    - `year`: Integer, publication year of the book.
    - `author`: Text, author of the book.

### Providers

Two main objects (providers) are available for operation through WebSocket using BeyondJS bridges:

-   **User Provider**: Located at `tests\modules\backend\provider\bridge`. Manages user-related operations.
-   **Books Provider**: Also located in the same directory but noted as incomplete. Intended to manage book-related
    operations.

These providers facilitate the interaction between the backend and the frontend or other services through WebSocket
communication.

### User Model

The user model can be found at `tests\modules\backend\models\user` and represents the structure and behavior of the user
data within the application.

### Express Server and Routing

An Express server is configured to follow the OpenAPI standard, with routes defined in
`tests\modules\backend\http\routes\users\index.ts`. The available routes for user management include:

-   `GET /users`: Fetch all users.
-   `GET /users/:id`: Fetch a single user by ID.
-   `POST /users`: Create a new user.
-   `PUT /users/:id`: Update an existing user by ID.
-   `DELETE /users/:id`: Delete a user by ID.

These routes facilitate RESTful API interactions for managing user data within the application.
