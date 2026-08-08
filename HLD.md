# MiniStudio - High Level Design (HLD)

# 1. System Overview

MiniStudio is a full-stack web application that allows authenticated users to create, edit, save, manage, and download graphic designs using a browser-based editor.

The application follows a client-server architecture where the frontend communicates with the backend using REST APIs.

---

# 2. Architecture Diagram

                    +----------------------+
                    |     React Frontend   |
                    |----------------------|
                    | Login/Register       |
                    | Editor (Fabric.js)   |
                    | Sidebar              |
                    +----------+-----------+
                               |
                        HTTP (Axios)
                               |
                               ▼
                    +----------------------+
                    |   Express Backend    |
                    |----------------------|
                    | Authentication       |
                    | Design APIs          |
                    | JWT Middleware       |
                    +----------+-----------+
                               |
                         Mongoose ODM
                               |
                               ▼
                    +----------------------+
                    |      MongoDB         |
                    |----------------------|
                    | Users Collection     |
                    | Designs Collection   |
                    +----------------------+

---

# 3. Major Components

## Frontend

The frontend is built using React.

Main responsibilities:

- Display UI
- Handle user interactions
- Manage canvas using Fabric.js
- Send API requests using Axios
- Store JWT token in localStorage

Main Components

- App
- Login
- Register
- Editor
- Sidebar

---

## Backend

The backend is built using Node.js and Express.

Responsibilities:

- Authenticate users
- Validate JWT
- Process CRUD requests
- Interact with MongoDB
- Return JSON responses

Main modules:

- Routes
- Controllers
- Middleware
- Models

---

## Database

MongoDB stores application data.

Collections:

### Users

Stores

- Username
- Email
- Password (hashed)

### Designs

Stores

- Title
- Canvas JSON
- User ID
- Created Date
- Updated Date

---

# 4. Request Flow

Example: Save Design

1. User clicks Save
2. React converts canvas to JSON
3. Axios sends POST request
4. JWT middleware verifies user
5. Controller validates request
6. Mongoose stores design
7. MongoDB saves document
8. Success response returned
9. Frontend refreshes sidebar

---

# 5. Authentication Flow

1. User registers
2. Password hashed using bcrypt
3. User logs in
4. JWT token generated
5. Token stored in localStorage
6. Frontend sends token in Authorization header
7. Middleware verifies token
8. Protected API executes

---

# 6. Design Decisions

## Why React?

- Component-based architecture
- Easy state management
- Reusable UI
- Efficient rendering

## Why Fabric.js?

- Object-oriented canvas
- Easy manipulation of text, shapes, and images
- Supports JSON serialization

## Why MongoDB?

- Stores Fabric.js JSON directly
- Flexible schema
- Easy integration with Mongoose

## Why JWT?

- Stateless authentication
- Secure API access
- Easy integration with React

---

# 7. Error Handling

Frontend

- Displays alerts for failures
- Prevents unauthorized access

Backend

- try-catch blocks
- Appropriate HTTP status codes
- JWT validation
- Error messages returned as JSON

---

# 8. Future Improvements

- Real-time collaboration
- AI-assisted design suggestions
- Templates
- Version history
- Cloud storage
- Multi-page designs